import { TRPCError } from "@trpc/server";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { destroyAuthSession, issueAuthSession } from "./_core/session";
import { z } from "zod";
import { getProducts, getAllProducts, getFeaturedProducts, getProductById, getCategories, getActiveBanners, createOrder, getOrders, createProduct, updateProduct, deleteProduct, createCategory, deleteCategory, createBanner, updateBanner, deleteBanner, getAllBanners, getCustomerById, updateCustomerProfile, getCustomerAddresses, createCustomerAddress, getCustomerOrders, createCustomerOrder, getAllCustomerOrders, getCustomerOrderById, getOrderStats, getMyOrders, getAdminOrders, updateOrderDeliveryStatus, updateOrderPaymentStatus, createCanonicalOrder } from "./db";
import { deleteAddressForUser, updateAddressForUser } from "./addressAuthorization";
import { getDb } from "./db";
import { customerOrders, orders } from "../drizzle/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { generateImage } from "./_core/imageGeneration";
import { registerCustomer, loginCustomer, getUserById, changePassword } from "./auth";
import { sendConversionsAPIEvent, getClientIP, getUserAgent, getFBPCookie, getFBCCookie, generateFBCFromFbclid, getFbclidFromUrl, getStableSessionId, generateStableExternalId } from "./_core/metaConversionsAPI";
import { getLatestRankings, calculateRankingTrends, getRankingHistory, generateWeeklyReport } from "./seoRankingTracker";
import { createBOGOrder, isBOGConfigured, isBOGCallbackVerificationAvailable } from "./_core/bog";
import { getBogCardPaymentMode } from "./_core/env";
import {
  calculateCanonicalPayment,
  canonicalBOGAmounts,
  publicPaymentStatus,
  resolveTrustedPaymentStatus,
  type PaymentItemSelection,
} from "./paymentSecurity";

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
  // Recalculated from the product record on the server; retained for carts
  // created before this validation was introduced.
  price: z.number().nonnegative().optional(),
  selectedVariantId: z.string().optional(),
  selectedColorNameKa: z.string().optional(),
  selectedColorNameEn: z.string().optional(),
  selectedColorHex: z.string().optional(),
  customData: z.unknown().optional(),
});

async function canonicalizeOrderItems(items: Array<z.infer<typeof orderItemSchema>>) {
  const payment = await calculateCanonicalPayment(
    items.map(item => ({
      productId: item.productId,
      variantId: item.selectedVariantId,
      quantity: item.quantity,
      customData: item.customData,
    })),
    "pickup",
    getProductById,
  );
  return payment.items;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email"),
        phone: z.string().min(9, "Phone must be at least 9 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
      }).refine((data: any) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      }))
      .mutation(async ({ input }: any) => {
        try {
          const user = await registerCustomer(input.name, input.email, input.phone, input.password);
          return {
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
            },
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message || "Registration failed",
          });
        }
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email"),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await loginCustomer(input.email, input.password);
          await issueAuthSession(ctx.req, ctx.res, user.id);
          return {
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
            },
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: error.message || "Login failed",
          });
        }
      }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      await destroyAuthSession(ctx.req, ctx.res);
      return {
        success: true,
      } as const;
    }),
  }),

  // Product routers
  products: router({
    list: publicProcedure.query(() => getProducts()),
    listAll: adminProcedure.query(() => getAllProducts()),
    featured: publicProcedure.query(() => getFeaturedProducts()),
    // tRPC query procedures must return null rather than undefined when a
    // product is missing; React Query treats undefined as a failed response.
    byId: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => (await getProductById(input.id)) ?? null),
    getByType: publicProcedure.input(z.object({ type: z.string() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      const { products: productsTable, categories: categoriesTable } = await import('../drizzle/schema');
      const { eq, and } = await import('drizzle-orm');
      
      const result = await db.select({
        product: productsTable,
        category: categoriesTable,
      }).from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(and(
          eq(productsTable.isAvailable, true),
          eq(productsTable.unitType, input.type)
        ));
      
      return result.map((row: any) => ({
        ...row.product,
        category: row.category,
      }));
    }),
    create: adminProcedure
      .input(z.object({
        nameEn: z.string(),
        nameKa: z.string(),
        descriptionEn: z.string().optional(),
        descriptionKa: z.string().optional(),
        categoryId: z.number(),
        priceMin: z.number().nullable(),
        priceMax: z.number().nullable(),
        priceOnRequest: z.boolean(),
        unitType: z.string(),
        isAvailable: z.boolean(),
        imageUrl: z.string().nullable().optional(),
        featured: z.boolean().optional(),
        variants: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        const { variants, ...productData } = input;
        const result = await createProduct(productData);
        if (variants && result.id) {
          const db = await getDb();
          if (db) {
            const { eq } = await import('drizzle-orm');
            const { products: productsTable } = await import('../drizzle/schema');
            await db.update(productsTable).set({ variants: variants as any }).where(eq(productsTable.id, result.id));
          }
        }
        return result;
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameKa: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionKa: z.string().optional(),
        categoryId: z.number().optional(),
        priceMin: z.number().nullable().optional(),
        priceMax: z.number().nullable().optional(),
        priceOnRequest: z.boolean().optional(),
        unitType: z.string().optional(),
        isAvailable: z.boolean().optional(),
        imageUrl: z.string().nullable().optional(),
        featured: z.boolean().optional(),
        variants: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, variants, ...updates } = input;
        const result = await updateProduct(id, updates);
        if (variants !== undefined) {
          const db = await getDb();
          if (db) {
            const { eq } = await import('drizzle-orm');
            const { products: productsTable } = await import('../drizzle/schema');
            await db.update(productsTable).set({ variants: variants as any }).where(eq(productsTable.id, id));
          }
        }
        return result;
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProduct(input.id);
      }),
  }),

  // Product variants management
  variants: router({
    addVariant: adminProcedure
      .input(z.object({
        productId: z.number(),
        colorNameKa: z.string(),
        colorNameEn: z.string(),
        colorHex: z.string(),
        imageUrl: z.string().optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
        available: z.boolean().default(true),
        isDefault: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const { productId, ...variant } = input;
        const result = await (await import("./db")).addProductVariant(productId, variant);
        return { success: !!result };
      }),
    updateVariant: adminProcedure
      .input(z.object({
        productId: z.number(),
        variantId: z.string(),
        colorNameKa: z.string().optional(),
        colorNameEn: z.string().optional(),
        colorHex: z.string().optional(),
        imageUrl: z.string().optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
        available: z.boolean().optional(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { productId, variantId, ...updates } = input;
        const result = await (await import("./db")).updateProductVariant(productId, variantId, updates);
        return { success: !!result };
      }),
    deleteVariant: adminProcedure
      .input(z.object({
        productId: z.number(),
        variantId: z.string(),
      }))
      .mutation(async ({ input }) => {
        const result = await (await import("./db")).deleteProductVariant(input.productId, input.variantId);
        return { success: !!result };
      }),
  }),

  // Category routers
  categories: router({
    list: publicProcedure.query(() => getCategories()),
    create: adminProcedure
      .input(z.object({
        nameEn: z.string(),
        nameKa: z.string(),
        slug: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await createCategory(input);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteCategory(input.id);
      }),
  }),

  // Banner routers
  banners: router({
    list: publicProcedure.query(() => getActiveBanners()),
    all: adminProcedure.query(() => getAllBanners()),
    create: adminProcedure
      .input(z.object({
        titleEn: z.string(),
        titleKa: z.string(),
        descriptionEn: z.string().optional(),
        descriptionKa: z.string().optional(),
        imageUrl: z.string(),
        linkUrl: z.string().optional(),
        isActive: z.boolean(),
        sortOrder: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await createBanner(input);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBanner(input.id);
      }),
  }),

  // Order routers
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().optional(),
        customerPhone: z.string().optional(),
        items: z.array(orderItemSchema).min(1),
        totalPrice: z.number(),
        notes: z.string().optional(),
        orderChannel: z.enum(["whatsapp", "messenger", "phone", "email", "card", "website"]),
        deliveryAddress: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        placeId: z.string().optional(),
        building: z.string().optional(),
        entrance: z.string().optional(),
        floor: z.string().optional(),
        apartment: z.string().optional(),
        deliveryDate: z.string().optional(),
        deliveryTime: z.string().optional(),
        giftMessage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const items = await canonicalizeOrderItems(input.items);
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Determine payment status and method based on order channel
        let paymentStatus: 'pending_payment' | 'paid' | 'failed' | 'cancelled' | 'refunded' = 'pending_payment';
        let paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'whatsapp' = 'whatsapp';
        
        if (input.orderChannel === 'whatsapp') {
          paymentStatus = 'pending_payment';
          paymentMethod = 'whatsapp';
        } else if (input.orderChannel === 'messenger') {
          paymentStatus = 'pending_payment';
          paymentMethod = 'cash';
        } else if (input.orderChannel === 'phone') {
          paymentStatus = 'pending_payment';
          paymentMethod = 'cash';
        } else if (input.orderChannel === 'card' || input.orderChannel === 'website') {
          paymentStatus = 'pending';
          paymentMethod = 'card';
        }
        
        // Create order in canonical orders table
        const order = await createCanonicalOrder({
          userId: null,
          customerName: input.customerName,
          customerEmail: input.customerEmail || null,
          customerPhone: input.customerPhone || null,
          recipientName: input.customerName,
          recipientPhone: input.customerPhone,
          deliveryAddress: input.deliveryAddress || '',
          latitude: input.latitude ? parseFloat(input.latitude.toString()) : undefined,
          longitude: input.longitude ? parseFloat(input.longitude.toString()) : undefined,
          placeId: input.placeId,
          building: input.building,
          entrance: input.entrance,
          floor: input.floor,
          apartment: input.apartment,
          deliveryDate: input.deliveryDate || new Date().toISOString().split('T')[0],
          deliveryTime: input.deliveryTime,
          giftMessage: input.giftMessage,
          items,
          totalPrice,
          paymentStatus,
          paymentMethod,
          deliveryStatus: 'new',
          courierNotes: input.notes,
          orderChannel: input.orderChannel,
          metaFbc: null,
          metaFbp: null,
        });
        
        // Notify owner
        const itemsDetails = items.map(item => {
          const colorText = item.selectedColorNameEn ? ` (${item.selectedColorNameEn})` : '';
          return `Product #${item.productId}${colorText}: ${item.quantity} x ₾${item.price}`;
        }).join(', ');
        try {
          await notifyOwner({
            title: `New Order from ${input.customerName}`,
            content: `Order via ${input.orderChannel}\n\nItems: ${itemsDetails}\n\nTotal: ₾${totalPrice}\n\nCustomer: ${input.customerName}\nPhone: ${input.customerPhone || 'N/A'}\nEmail: ${input.customerEmail || 'N/A'}`,
          });
        } catch (error) {
          console.warn("[Orders] Order saved, but owner notification was not sent:", error instanceof Error ? error.message : "unknown error");
        }
        
        return order;
      }),
    checkout: publicProcedure
      .input(z.object({
        items: z.array(orderItemSchema.omit({ customData: true })).min(1),
        totalPrice: z.number(),
        customerName: z.string(), // For guests
        customerEmail: z.string().optional(), // For guests
        customerPhone: z.string(), // For guests
        recipientName: z.string(),
        recipientPhone: z.string(),
        deliveryAddress: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        placeId: z.string().optional(),
        building: z.string().optional(),
        entrance: z.string().optional(),
        floor: z.string().optional(),
        apartment: z.string().optional(),
        deliveryDate: z.string(),
        deliveryTime: z.string().optional(),
        giftMessage: z.string().optional(),
        fulfillmentType: z.enum(["delivery", "pickup"]).optional(),
        paymentMethod: z.enum(["cash", "card", "bank_transfer", "whatsapp"]),
      }))
      .mutation(async ({ ctx, input }) => {
        // Support both authenticated users and guests
        const userId = ctx.user?.id || null;
        
        const items = await canonicalizeOrderItems(input.items);
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        const order = await createCanonicalOrder({
          userId: userId,
          customerName: input.customerName || input.recipientName,
          customerEmail: input.customerEmail || null,
          customerPhone: input.customerPhone || input.recipientPhone,
          items,
          totalPrice,
          recipientName: input.recipientName,
          recipientPhone: input.recipientPhone,
          deliveryAddress: input.deliveryAddress,
          latitude: input.latitude ? parseFloat(input.latitude.toString()) : undefined,
          longitude: input.longitude ? parseFloat(input.longitude.toString()) : undefined,
          placeId: input.placeId,
          building: input.building,
          entrance: input.entrance,
          floor: input.floor,
          apartment: input.apartment,
          deliveryDate: input.deliveryDate,
          deliveryTime: input.deliveryTime,
          giftMessage: input.giftMessage,
          paymentMethod: input.paymentMethod,
          paymentStatus: 'pending',
          orderChannel: 'website',
          metaFbc: null,
          metaFbp: null,
        });
        
        // Notify owner
        const itemsDetails = items.map(item => {
          const colorText = item.selectedColorNameEn ? ` (${item.selectedColorNameEn})` : '';
          return `Product #${item.productId}${colorText}: ${item.quantity} x ₾${item.price}`;
        }).join(', ');
        try {
          await notifyOwner({
            title: `New Order from ${input.recipientName}`,
            content: `Order via checkout\n\nItems: ${itemsDetails}\n\nTotal: ₾${totalPrice}\n\nRecipient: ${input.recipientName}\nPhone: ${input.recipientPhone}\nDelivery: ${input.deliveryDate} ${input.deliveryTime || ''}\nAddress: ${input.deliveryAddress}\nPayment: ${input.paymentMethod}`,
          });
        } catch (error) {
          console.warn("[Orders] Order saved, but owner notification was not sent:", error instanceof Error ? error.message : "unknown error");
        }
        
        return order;
      }),
    list: adminProcedure.query(() => getOrders()),
    stats: adminProcedure.query(() => getOrderStats()),
    detail: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        return getCustomerOrderById(input.id);
      }),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "preparing", "delivered", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
        return { success: true };
      }),
    deleteOrder: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(orders).where(eq(orders.id, input.id));
        return { success: true };
      }),
  }),
  
  // Profile management
  profile: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
      return getCustomerById(ctx.user.id);
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(2),
        phone: z.string().min(9),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
        await updateCustomerProfile(ctx.user.id, input);
        return { success: true };
      }),
    changePassword: protectedProcedure
      .input(z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(6),
        confirmPassword: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
        if (input.newPassword !== input.confirmPassword) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: "Passwords don't match" });
        }
        try {
          await changePassword(ctx.user.id, input.oldPassword, input.newPassword);
          return { success: true };
        } catch (error: any) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
        }
      }),
    // Customer orders (authenticated users only)
    myOrders: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
        return getMyOrders(ctx.user.id);
      }),
    }),
  }),
  
  // Address management
  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
      return getCustomerAddresses(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        label: z.string().optional(),
        recipientName: z.string(),
        recipientPhone: z.string(),
        address: z.string(),
        city: z.string(),
        postalCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
        return createCustomerAddress({ ...input, userId: ctx.user.id });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        label: z.string().optional(),
        recipientName: z.string(),
        recipientPhone: z.string(),
        address: z.string(),
        city: z.string(),
        postalCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await updateAddressForUser(ctx.user.id, id, updates);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteAddressForUser(ctx.user.id, input.id);
        return { success: true };
      }),
  }),
  
  
  // Cart management (client-side state, no backend persistence)
  cart: router({
    add: publicProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number(),
        customData: z.any().optional(),
        previewImage: z.string().optional(),
        generatedImageUrl: z.string().optional(),
        bouquetType: z.enum(['visual', 'ai']).optional(),
      }))
      .mutation(async ({ input }) => {
        // This is a placeholder - cart is managed client-side
        // In a real app, you'd persist this to a database
        return { success: true, item: input };
      }),
  }),
  
  // Bouquet AI generation
  bouquet: router({
    testGenerate: publicProcedure
      .mutation(async () => {
        try {
          const { generateBouquetImageWithPollinations } = await import("./_core/pollinationsImageGeneration");
          
          console.log('[Bouquet Test] Starting test image generation...');
          
          // Simple test with fixed flowers
          const testFlowers = [
            {
              nameEn: 'spray rose',
              nameKa: 'სპრეი ვარდი',
              quantity: 3,
              colorEn: 'Pink',
              colorKa: 'ვარდისფერი',
              bloomsPerStemMin: 5,
              bloomsPerStemMax: 7,
              stemDisplayRule: 'spray',
            }
          ];
          
          const result = await generateBouquetImageWithPollinations({
            flowers: testFlowers,
          });
          
          console.log('[Bouquet Test] Result:', result);
          
          if (result && result.url) {
            console.log('[Bouquet Test] ✅ Test successful - URL:', result.url);
            return {
              success: true,
              imageUrl: result.url,
              provider: 'pollinations',
              testMode: true,
            };
          } else {
            console.error('[Bouquet Test] ❌ Test failed - no URL returned');
            return {
              success: false,
              imageUrl: null,
              provider: 'none',
              testMode: true,
              error: 'No URL returned from provider',
            };
          }
        } catch (error: any) {
          console.error('[Bouquet Test] Exception:', error);
          return {
            success: false,
            imageUrl: null,
            provider: 'none',
            testMode: true,
            error: error?.message || 'Unknown error',
          };
        }
      }),
    generateImage: publicProcedure
      .input(z.object({
        flowers: z.array(z.object({
          nameKa: z.string(),
          nameEn: z.string(),
          quantity: z.number(),
          colorNameEn: z.string().optional(),
          colorNameKa: z.string().optional(),
        })),
      }))
      .mutation(async ({ input }) => {
        try {
          const { generateBouquetImageWithPollinations } = await import("./_core/pollinationsImageGeneration");
          const { findBestBouquetPreview } = await import("./_core/bouquetPreviewLibrary");
          const { getProductByName } = await import("./db");
          
          // Fetch flower metadata (bloom counts, stem display rules) from database
          const flowersWithMetadata = await Promise.all(
            input.flowers.map(async (flower) => {
              // Find product by name to get stem metadata
              const product = await getProductByName(flower.nameEn, flower.nameKa);
              return {
                nameEn: flower.nameEn,
                nameKa: flower.nameKa,
                quantity: flower.quantity,
                colorEn: flower.colorNameEn,
                colorKa: flower.colorNameKa,
                bloomsPerStemMin: product?.bloomsPerStemMin || 1,
                bloomsPerStemMax: product?.bloomsPerStemMax || 1,
                stemDisplayRule: product?.stemDisplayRule,
              };
            })
          );
          
          // Try Pollinations AI first with enhanced prompt from stem metadata
          const pollinationsResult = await generateBouquetImageWithPollinations({
            flowers: flowersWithMetadata,
          });
          
          // Validate Pollinations result
          if (pollinationsResult && pollinationsResult.url) {
            const url = pollinationsResult.url;
            if (typeof url === 'string' && url.length > 0 && url.startsWith('/')) {
              console.log('[Bouquet] Pollinations success - returning URL:', url);
              return {
                success: true,
                imageUrl: url,
                provider: 'pollinations',
              };
            } else {
              console.warn('[Bouquet] Pollinations returned invalid URL:', url);
            }
          }
          
          // Fall back to preview library
          const preview = findBestBouquetPreview(input.flowers);
          if (preview && preview.imageUrl) {
            const previewUrl = preview.imageUrl;
            if (typeof previewUrl === 'string' && previewUrl.length > 0) {
              console.log('[Bouquet] Using fallback preview - URL:', previewUrl);
              return {
                success: true,
                imageUrl: previewUrl,
                provider: 'fallback',
              };
            }
          }
          
          // No valid preview available
          console.warn('[Bouquet] No valid image URL available - all sources failed');
          return {
            success: false,
            imageUrl: null,
            provider: 'none',
          };
        } catch (error: any) {
          console.error('[Bouquet] Error generating image:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to generate bouquet image',
          });
        }
      }),
  }),
  // Meta Conversions API tracking
  tracking: router({
    trackEvent: publicProcedure
      .input(z.object({
        eventName: z.string(),
        eventId: z.string(),
        eventSourceUrl: z.string().optional(),
        userData: z.record(z.string(), z.any()).optional(),
        customData: z.record(z.string(), z.any()).optional(),
        fbp: z.string().optional(),
        fbc: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Get request object from context to extract IP and user agent
          const req = (ctx as any).req;
          const clientIP = getClientIP(req);
          const userAgent = getUserAgent(req);
          
          // Use eventSourceUrl from client if provided, otherwise use referer
          const eventSourceUrl = input.eventSourceUrl || req.headers.referer || '';

          // Extract FBP/FBC cookies from request headers
          let fbpCookie = getFBPCookie(req);
          let fbcCookie = getFBCCookie(req);
          
          // If FBP/FBC provided by client, use those (they may be more current)
          const fbpFromClient = input.fbp || fbpCookie;
          let fbcFromClient = input.fbc || fbcCookie;
          
          // If no FBC but fbclid in URL, generate FBC
          if (!fbcFromClient && eventSourceUrl) {
            const fbclid = getFbclidFromUrl(eventSourceUrl);
            if (fbclid) {
              fbcFromClient = generateFBCFromFbclid(fbclid);
            }
          }
          
          // Generate stable anonymous external_id if not provided
          let externalId = input.userData?.externalId;
          if (!externalId) {
            const stableSessionId = getStableSessionId(req);
            externalId = generateStableExternalId(stableSessionId);
          }

          // Prepare user data with IP, user agent, FBP/FBC, and external_id
          // Only include real user data - do not send fake/hashed values
          const userData: Record<string, any> = {
            ipAddress: clientIP,
            userAgent: userAgent,
            ...(fbpFromClient && { fbp: fbpFromClient }),
            ...(fbcFromClient && { fbc: fbcFromClient }),
            ...(externalId && { externalId }),
          };
          
          // Only add user data fields if they contain real values
          if (input.userData) {
            if (input.userData.email && typeof input.userData.email === 'string' && input.userData.email.length > 0) {
              userData.email = input.userData.email;
            }
            if (input.userData.phone && typeof input.userData.phone === 'string' && input.userData.phone.length > 0) {
              userData.phone = input.userData.phone;
            }
            if (input.userData.firstName && typeof input.userData.firstName === 'string' && input.userData.firstName.length > 0) {
              userData.firstName = input.userData.firstName;
            }
            if (input.userData.lastName && typeof input.userData.lastName === 'string' && input.userData.lastName.length > 0) {
              userData.lastName = input.userData.lastName;
            }
          }

          // Log safe debug info (no sensitive data)
          console.log('[Meta CAPI] Event tracked:', {
            eventName: input.eventName,
            eventId: input.eventId,
            has_fbp: !!fbpFromClient,
            has_fbc: !!fbcFromClient,
            has_external_id: !!externalId,
            client_ip_source: clientIP ? 'extracted' : 'none',
          });

          // Send to Meta Conversions API
          const success = await sendConversionsAPIEvent({
            eventName: input.eventName,
            eventId: input.eventId,
            eventTime: Math.floor(Date.now() / 1000),
            userData,
            customData: input.customData,
            eventSourceUrl,
          });

          return { success };
        } catch (error: any) {
          console.error('[Tracking] Error tracking event:', error);
          // Don't throw error - tracking failures shouldn't break the app
          return { success: false };
        }
      }),
  }),
  seo: router({
    getLatestRankings: adminProcedure
      .query(async () => {
        try {
          const rankings = await getLatestRankings();
          return rankings;
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch rankings",
          });
        }
      }),
    getRankingTrends: adminProcedure
      .query(async () => {
        try {
          const trends = await calculateRankingTrends();
          return trends;
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch trends",
          });
        }
      }),
    getRankingHistory: adminProcedure
      .input(z.object({
        keywordId: z.number(),
        days: z.number().optional().default(30),
      }))
      .query(async ({ input }) => {
        try {
          const history = await getRankingHistory(input.keywordId, input.days);
          return history;
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch ranking history",
          });
        }
      }),
    getWeeklyReport: adminProcedure
      .query(async () => {
        try {
          const report = await generateWeeklyReport();
          return report;
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate report",
          });
        }
      }),
  }),
  
  // Bank of Georgia Payment
  payments: router({
    createBOGOrder: protectedProcedure
      .input(z.object({
        customerName: z.string().min(2).max(255),
        customerEmail: z.string().email().max(320).optional(),
        customerPhone: z.string().min(9).max(20).optional(),
        recipientName: z.string().max(255).optional(),
        recipientPhone: z.string().max(20).optional(),
        items: z.array(z.object({
          productId: z.number().int().positive(),
          variantId: z.string().min(1).max(255).optional(),
          quantity: z.number().int().min(1).max(99),
          customData: z.unknown().optional(),
        })).min(1).max(99),
        notes: z.string().max(2_000).optional(),
        deliveryAddress: z.string().max(2_000).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        placeId: z.string().max(255).optional(),
        building: z.string().max(50).optional(),
        entrance: z.string().max(50).optional(),
        floor: z.string().max(50).optional(),
        apartment: z.string().max(50).optional(),
        deliveryDate: z.string().max(20).optional(),
        deliveryTime: z.string().max(20).optional(),
        giftMessage: z.string().max(2_000).optional(),
        fulfillmentType: z.enum(['delivery', 'pickup']).default('delivery'),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check BOG card payment mode BEFORE creating any orders
        const mode = getBogCardPaymentMode();
        
        if (mode === 'disabled') {
          throw new TRPCError({
            code: 'SERVICE_UNAVAILABLE',
            message: 'CARD_PAYMENT_DISABLED',
          });
        }
        
        if (mode === 'admin_only') {
          if (!ctx.user) {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'CARD_PAYMENT_ADMIN_ONLY',
            });
          }
          
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'CARD_PAYMENT_ADMIN_ONLY',
            });
          }
        }
        
        if (!isBOGConfigured()) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'BOG payment is not configured',
          });
        }

        const selections: PaymentItemSelection[] = input.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          customData: item.customData,
        }));
        const canonicalPayment = await calculateCanonicalPayment(
          selections,
          input.fulfillmentType,
          getProductById,
        );
        const bogAmounts = canonicalBOGAmounts(canonicalPayment);

        // Create local order first, get order number
        let localOrder;
        try {
          localOrder = await createCanonicalOrder({
            userId: ctx.user.id,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            recipientName: input.fulfillmentType === 'pickup' ? undefined : input.recipientName,
            recipientPhone: input.fulfillmentType === 'pickup' ? undefined : input.recipientPhone,
            items: canonicalPayment.items,
            totalPrice: canonicalPayment.finalTotal,
            notes: input.notes,
            orderChannel: 'website',
            paymentMethod: 'card',
            deliveryAddress: input.fulfillmentType === 'pickup' ? undefined : input.deliveryAddress,
            building: input.fulfillmentType === 'pickup' ? undefined : input.building,
            entrance: input.fulfillmentType === 'pickup' ? undefined : input.entrance,
            floor: input.fulfillmentType === 'pickup' ? undefined : input.floor,
            apartment: input.fulfillmentType === 'pickup' ? undefined : input.apartment,
            deliveryDate: input.deliveryDate,
            deliveryTime: input.deliveryTime,
            giftMessage: input.giftMessage,
            latitude: input.fulfillmentType === 'pickup' ? undefined : input.latitude,
            longitude: input.fulfillmentType === 'pickup' ? undefined : input.longitude,
            placeId: input.fulfillmentType === 'pickup' ? undefined : input.placeId,
            fulfillmentType: input.fulfillmentType,
            deliveryFee: canonicalPayment.deliveryFee,
            paymentStatus: 'pending',
            metaFbc: null,
            metaFbp: null,
          });
        } catch (dbError) {
          console.error('[BOG Order] Database error creating order:', dbError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create local order: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`,
          });
        }

        if (!localOrder || !localOrder.orderNumber) {
          console.error('[BOG Order] Invalid local order:', { localOrder });
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create local order: No order number generated',
          });
        }

        // Use order number as external ID for BOG
        const externalOrderId = `FLR-${localOrder.orderNumber}`;

        const result = await createBOGOrder({
          orderId: externalOrderId,
          amount: bogAmounts.amount,
          currency: 'GEL',
          description: `Flower's Boutique Order ${localOrder.orderNumber}`,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerName: input.customerName,
          basketItems: bogAmounts.basketItems,
          deliveryAmount: bogAmounts.deliveryAmount,
          userId: ctx.user.id,
          localOrderId: localOrder.id, // Pass local order ID for linking
        });
        
        if (!result.success) {
          return {
            success: false,
            redirectUrl: undefined,
            orderId: undefined,
            error: result.userMessage || 'Failed to create BOG order',
            errorCode: result.errorCode,
            diagnostic: result.diagnostic,
          };
        }

        return {
          success: true,
          redirectUrl: result.redirectUrl,
          orderId: externalOrderId,
          bogOrderId: result.bogOrderId,
          bogExternalOrderId: result.bogExternalOrderId,
          error: undefined,
        };
      }),
    getPaymentStatus: protectedProcedure
      .input(z.object({ orderId: z.string().regex(/^FLR-\d{6,}$/) }))
      .query(async ({ ctx, input }) => {
        const { findOrderByBOGExternalId } = await import('./db');
        const order = await findOrderByBOGExternalId(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment order not found' });
        }
        if (ctx.user.role !== 'admin' && order.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment order not found' });
        }

        return {
          orderNumber: order.orderNumber,
          orderId: order.bogExternalOrderId,
          status: publicPaymentStatus(order.paymentStatus, order.bogPaymentStatus),
          updatedAt: order.updatedAt,
        };
      }),
  }),
  // Admin order management
  admin: router({
    orders: router({
      list: adminProcedure
        .input(z.object({
          paymentStatus: z.string().optional(),
          deliveryStatus: z.string().optional(),
          searchTerm: z.string().optional(),
        }))
        .query(async ({ input }) => {
          const { getAdminOrders } = await import('./db');
          return getAdminOrders(input);
        }),
      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const { getOrderById } = await import('./db');
          return getOrderById(input.id);
        }),
      updateDeliveryStatus: adminProcedure
        .input(z.object({
          orderId: z.number(),
          deliveryStatus: z.enum(['new', 'processing', 'preparing', 'courier', 'delivered', 'cancelled']),
          additionalComment: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { updateOrderDeliveryStatus } = await import('./db');
          return updateOrderDeliveryStatus(input.orderId, input.deliveryStatus, input.additionalComment);
        }),
      updatePaymentStatus: adminProcedure
        .input(z.object({
          orderId: z.number(),
          paymentStatus: z.enum(['pending_payment', 'paid', 'failed', 'cancelled', 'refunded']),
        }))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          const [order] = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1);
          if (!order) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
          }
          if (order.paymentMethod === 'card' && input.paymentStatus === 'paid') {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'CARD_PAYMENT_STATUS_REQUIRES_VERIFIED_BOG_RESPONSE',
            });
          }
          const { updateOrderPaymentStatus } = await import('./db');
          return updateOrderPaymentStatus(input.orderId, input.paymentStatus);
        }),
      cancelOrder: adminProcedure
        .input(z.object({
          orderId: z.number(),
        }))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          
          // Get the order first
          const orderList = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1);
          const order = orderList.length > 0 ? orderList[0] : null;
          
          if (!order) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
          }
          
          // Update delivery status to cancelled
          await db.update(orders)
            .set({
              deliveryStatus: 'cancelled',
              // If payment is not paid, also cancel payment status
              ...(order.paymentStatus !== 'paid' && { paymentStatus: 'cancelled' }),
            })
            .where(eq(orders.id, input.orderId));
          
          return { success: true };
        }),
      deleteOrder: adminProcedure
        .input(z.object({
          orderId: z.number(),
        }))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          
          // Delete the order
          await db.delete(orders).where(eq(orders.id, input.orderId));
          
          return { success: true };
        }),
      stats: adminProcedure
        .query(async () => {
          const { getAdminOrderStats } = await import('./db');
          return getAdminOrderStats();
        }),
      reconcileFromBOG: adminProcedure
        .input(z.object({
          orderId: z.number(),
        }))
        .mutation(async ({ input }) => {
          
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          
          // Get the order from new orders table
          const orderList = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1);
          const order = orderList.length > 0 ? orderList[0] : null;
          
          if (!order) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
          }
          
          if (!order.bogExternalOrderId) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Order does not have a BOG external order ID' });
          }
          
          // Query BOG for current payment status
          const { getBOGOrderStatus } = await import('./_core/bog');
          const bogStatus = await getBOGOrderStatus(order.bogExternalOrderId);
          
          if (!bogStatus.success) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: bogStatus.error || 'Failed to get BOG status' });
          }
          
          // Reconciliation is a trusted server-to-server status authority.
          const { updateOrderBOGPayment } = await import('./db');
          const paymentStatus = resolveTrustedPaymentStatus(order.paymentStatus, bogStatus.status);
          
          const updated = await updateOrderBOGPayment(input.orderId, {
            bogOrderId: bogStatus.bogOrderId,
            bogPaymentStatus: bogStatus.status,
            paymentLastCheckedAt: new Date(),
            paymentStatus: paymentStatus,
            paidAt: bogStatus.status === 'completed' ? (order.paidAt ?? new Date()) : undefined,
          });
          
          return {
            success: true,
            order: updated,
            bogStatus: bogStatus.status,
            paymentStatus: paymentStatus,
          };
        }),
    }),
  }),

  // Geoapify backend proxy
  geoapify: router({
    searchAddresses: publicProcedure
      .input(z.object({
        query: z.string().min(2),
        language: z.enum(["en", "ka"]).default("ka"),
      }))
      .query(async ({ input }) => {
        const apiKey = process.env.VITE_GEOAPIFY_API_KEY;
        if (!apiKey) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Geoapify API key not configured",
          });
        }

        try {
          const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
          url.searchParams.append("text", input.query.trim());
          url.searchParams.append("format", "json");
          url.searchParams.append("filter", "countrycode:ge");
          url.searchParams.append("bias", "proximity:44.8271,41.7151");
          url.searchParams.append("limit", "8");
          url.searchParams.append("lang", input.language);
          url.searchParams.append("apiKey", apiKey);

          let response = await fetch(url.toString());
          if (!response.ok) {
            console.error(`[Geoapify] Autocomplete HTTP ${response.status}`);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Geoapify API error: ${response.status}`,
            });
          }

          let data = await response.json();
          let results = data.results || [];

          // Fallback: if no results, retry with type=locality for districts/neighborhoods
          if (results.length === 0) {
            console.log(`[Geoapify] No results for "${input.query}", retrying with type=locality`);
            const localityUrl = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
            localityUrl.searchParams.append("text", input.query.trim());
            localityUrl.searchParams.append("format", "json");
            localityUrl.searchParams.append("filter", "countrycode:ge");
            localityUrl.searchParams.append("bias", "proximity:44.8271,41.7151");
            localityUrl.searchParams.append("type", "locality");
            localityUrl.searchParams.append("limit", "8");
            localityUrl.searchParams.append("lang", input.language);
            localityUrl.searchParams.append("apiKey", apiKey);

            response = await fetch(localityUrl.toString());
            if (response.ok) {
              data = await response.json();
              results = data.results || [];
              console.log(`[Geoapify] Locality search returned ${results.length} results`);
            }
          }

          console.log(`[Geoapify] Autocomplete for "${input.query}": ${results.length} results`);

          return results.map((result: any) => ({
            formatted: result.formatted || result.address_line1 || "",
            lat: result.lat,
            lon: result.lon,
            placeId: result.place_id,
            address_line1: result.address_line1,
            address_line2: result.address_line2,
            result_type: result.result_type,
          }));
        } catch (error: any) {
          console.error("[Geoapify] Search error:", error.message);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to search addresses",
          });
        }
      }),

    reverseGeocode: publicProcedure
      .input(z.object({
        lat: z.number(),
        lon: z.number(),
        language: z.enum(["en", "ka"]).default("ka"),
      }))
      .query(async ({ input }) => {
        const apiKey = process.env.VITE_GEOAPIFY_API_KEY;
        if (!apiKey) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Geoapify API key not configured",
          });
        }

        try {
          const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
          url.searchParams.append("lat", input.lat.toString());
          url.searchParams.append("lon", input.lon.toString());
          url.searchParams.append("format", "json");
          url.searchParams.append("lang", input.language);
          url.searchParams.append("apiKey", apiKey);

          const response = await fetch(url.toString());
          if (!response.ok) {
            console.error(`[Geoapify] Reverse geocoding HTTP ${response.status}`);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Geoapify API error: ${response.status}`,
            });
          }

          const data = await response.json();
          const results = data.results || [];

          if (results.length === 0) {
            console.log(`[Geoapify] No address found for lat=${input.lat}, lon=${input.lon}`);
            return {
              formatted: `${input.lat.toFixed(4)}, ${input.lon.toFixed(4)}`,
              lat: input.lat,
              lon: input.lon,
            };
          }

          const result = results[0];
          const formatted = result.formatted || result.address_line1 || `${input.lat.toFixed(4)}, ${input.lon.toFixed(4)}`;
          console.log(`[Geoapify] Reverse geocoding: ${formatted}`);

          return {
            formatted,
            lat: input.lat,
            lon: input.lon,
          };
        } catch (error: any) {
          console.error("[Geoapify] Reverse geocode error:", error.message);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to reverse geocode coordinates",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
