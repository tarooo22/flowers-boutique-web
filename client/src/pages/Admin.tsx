"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import ImageUploader from "@/components/ImageUploader";
import FlowerImage from "@/components/FlowerImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { VariantEditor } from "@/components/VariantEditor";

import { ProductFormModern } from "@/components/ProductFormModern";
import ProductEditDrawer from "@/components/ProductEditDrawer";
// Removed: AdminOrdersTab - now using dedicated AdminOrders page

export default function Admin() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const [, navigate] = useLocation();
  // Auto-activate settings tab if route is /admin/settings
  // Auto-activate orders tab if route is /admin/orders
  const initialTab = location === "/admin/settings" ? "settings" : location === "/admin/orders" ? "orders" : "products";
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "orders" | "banners" | "settings"
  >(initialTab);

  // Navigate to Orders page when orders tab is clicked
  useEffect(() => {
    if (activeTab === "orders") {
      navigate("/admin/orders");
    }
  }, [activeTab, navigate]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inlineEditingId, setInlineEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [filterCategory, setFilterCategory] = useState<number | null>(null);

  // ProductEditDrawer state
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productFormData, setProductFormData] = useState<any>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const { data: products, refetch: refetchProducts } =
    trpc.products.listAll.useQuery(undefined, {
      enabled: user?.role === "admin",
    });
  const { data: categories } = trpc.categories.list.useQuery();
  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      refetchProducts();
      toast.success(t("common.deleted"));
    },
    onError: () => toast.error(t("common.error")),
  });
  const deleteCategoryMutation = trpc.categories.delete.useMutation({
    onSuccess: () => toast.success(t("common.deleted")),
    onError: () => toast.error(t("common.error")),
  });
  const toggleFeaturedMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      refetchProducts();
      toast.success(
        language === "ka" ? "პროდუქტი განახლდა" : "Product updated"
      );
    },
    onError: () => toast.error(t("common.error")),
  });
  const toggleAvailabilityMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      refetchProducts();
      toast.success(
        language === "ka" ? "ხელმისაწვდომობა განახლდა" : "Availability updated"
      );
    },
    onError: () => toast.error(t("common.error")),
  });

  // Toggle inline editor - if same product clicked, close it; otherwise open new one
  const toggleInlineEditor = (productId: number) => {
    if (inlineEditingId === productId) {
      setInlineEditingId(null);
    } else {
      setInlineEditingId(productId);
    }
  };

  // Close inline editor
  const closeInlineEditor = () => {
    setInlineEditingId(null);
  };

  // Toggle featured status
  const handleToggleFeatured = async (product: any) => {
    await toggleFeaturedMutation.mutateAsync({
      id: product.id,
      featured: !product.featured,
    });
  };

  // Toggle availability status
  const handleToggleAvailability = async (product: any) => {
    await toggleAvailabilityMutation.mutateAsync({
      id: product.id,
      isAvailable: !product.isAvailable,
    });
  };

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #FAF8F5 0%, #F5F0E8 100%)",
        }}
        className="min-h-screen flex items-center justify-center"
      >
        <p className="text-[#888]">{t("common.loading")}</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen w-full overflow-x-hidden px-5 py-10 flex flex-col items-center justify-center gap-4 text-center bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8]">
        <h1 className="max-w-full break-words text-3xl font-serif font-bold leading-tight text-[#1C1917]">
          {language === "ka" ? "ადმინისტრირების პანელი" : "Admin Panel"}
        </h1>
        <p className="max-w-md text-[#666]">
          {language === "ka"
            ? "ამ გვერდზე წვდომა შეზღუდულია"
            : "Access to this page is restricted"}
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="bg-[#A16207] hover:bg-[#8B4D05] text-white"
        >
          {t("nav.home")}
        </Button>
      </div>
    );
  }

  const handleDeleteProduct = async (id: number) => {
    if (
      !confirm(
        language === "ka"
          ? "ნამდვილად გსურთ პროდუქტის წაშლა?"
          : "Delete this product?"
      )
    )
      return;
    await deleteProductMutation.mutateAsync({ id });
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        language === "ka"
          ? "ნამდვილად გსურთ კატეგორიის წაშლა?"
          : "Delete this category?"
      )
    )
      return;
    await deleteCategoryMutation.mutateAsync({ id });
  };

  return (
    <div className="admin-page p2-admin-page min-h-screen bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="fb-admin-header">
          <div className="fb-admin-header__identity">
            <span><ShieldCheck size={23} /></span>
            <div>
              <p>
                {language === "ka"
                  ? "FLOWER’S BOUTIQUE · მართვის ცენტრი"
                  : "FLOWER’S BOUTIQUE · CONTROL ROOM"}
              </p>
              <h1>{language === "ka" ? "ადმინისტრირების პანელი" : "Admin Panel"}</h1>
              <small>{language === "ka" ? "პროდუქტების, შეკვეთებისა და storefront-ის მართვა" : "Manage products, orders and storefront content"}</small>
            </div>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="fb-admin-store-link w-full sm:w-auto"
          >
            <Store size={17} />
            {language === "ka" ? "მაღაზიის ნახვა" : "View storefront"}
          </Button>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="fb-admin-tabs mb-8 overflow-x-auto">
          <div className="flex gap-2 sm:gap-4 min-w-min">
            {(
              ["products", "categories", "orders", "banners", "settings"] as const
            ).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setShowForm(false);
                  setEditingId(null);
                  setInlineEditingId(null);
                }}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "border-[#C4603A] text-[#C4603A]"
                    : "border-transparent text-[#666] hover:text-[#1C1917]"
                }`}
              >
                {tab === "products"
                  ? language === "ka"
                    ? "პროდუქტები"
                    : "Products"
                  : tab === "categories"
                    ? language === "ka"
                      ? "კატეგორიები"
                      : "Categories"
                    : tab === "orders"
                      ? language === "ka"
                        ? "შეკვეთები"
                        : "Orders"
                      : tab === "banners"
                        ? language === "ka"
                          ? "ბანერები"
                          : "Banners"
                        : language === "ka"
                          ? "პარამეტრები"
                          : "Settings"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Products Tab ── */}
        {activeTab === "products" && (
          <div>
            {/* Modern Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1C1917] mb-2">
                {language === "ka" ? "პროდუქტების მართვა" : "Manage Products"}
              </h2>
              <p className="text-[#666] text-sm">
                {language === "ka"
                  ? "დაამატეთ, შეცვალეთ და მართეთ Flower’s Boutique-ის პროდუქტები"
                  : "Add, edit and manage Flower’s Boutique products"}
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Search Input */}
              <div>
                <input
                  type="text"
                  placeholder={language === "ka" ? "ძებნა..." : "Search..."}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] text-sm"
                />
              </div>

              {/* Availability Filter */}
              <div>
                <select
                  value={filterAvailability}
                  onChange={e => setFilterAvailability(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] text-sm"
                >
                  <option value="all">
                    {language === "ka" ? "ყველა სტატუსი" : "All Status"}
                  </option>
                  <option value="available">
                    {language === "ka" ? "ხელმისაწვდომი" : "Available"}
                  </option>
                  <option value="unavailable">
                    {language === "ka" ? "მარაგში არ არის" : "Unavailable"}
                  </option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filterCategory || ""}
                  onChange={e =>
                    setFilterCategory(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full px-4 py-2.5 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] text-sm"
                >
                  <option value="">
                    {language === "ka" ? "ყველა კატეგორია" : "All Categories"}
                  </option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {language === "ka" ? cat.nameKa || cat.nameEn : cat.nameEn || cat.nameKa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Product Button */}
              <Button
                onClick={() => {
                  setIsCreateMode(true);
                  setSelectedProduct(null);
                  setIsProductDrawerOpen(true);
                }}
                className="w-full bg-[#A16207] hover:bg-[#8B4D05] text-white flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {language === "ka" ? "+ ახალი პროდუქტი" : "+ New"}
              </Button>
            </div>

            {/* Filter Results Count */}
            {products && (
              <div className="mb-4 text-sm text-[#666]">
                {(() => {
                  let filtered = products;
                  if (searchQuery) {
                    filtered = filtered.filter(
                      (p: any) =>
                        p.nameEn
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        p.nameKa
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    );
                  }
                  if (filterAvailability !== "all") {
                    filtered = filtered.filter((p: any) =>
                      filterAvailability === "available"
                        ? p.isAvailable
                        : !p.isAvailable
                    );
                  }
                  if (filterCategory) {
                    filtered = filtered.filter(
                      (p: any) => p.categoryId === filterCategory
                    );
                  }
                  return `${filtered.length} ${language === "ka" ? "პროდუქტი" : "products"}`;
                })()}
              </div>
            )}

            {showForm && (
              <div className="bg-white p-6 rounded-xl mb-6 border border-[#E8E4DF] shadow-sm">
                <ProductFormModern
                  editingId={editingId}
                  onClose={() => {
                    setShowForm(false);
                    setEditingId(null);
                    refetchProducts();
                  }}
                  language={language}
                />
              </div>
            )}

            {/* Products Table - Desktop only */}
            <div className="hidden md:block bg-white rounded-xl overflow-hidden border border-[#E8E4DF] shadow-sm">
              <table className="w-full">
                <thead className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8] border-b border-[#E8E4DF]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1C1917] w-16">
                      {language === "ka" ? "სურ." : "Img"}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1C1917]">
                      {language === "ka" ? "სახელი" : "Name"}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1C1917]">
                      {language === "ka" ? "კატეგორია" : "Category"}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1C1917]">
                      {language === "ka" ? "ფასი" : "Price"}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1C1917]">
                      {language === "ka" ? "სტატუსი" : "Status"}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1C1917]">
                      {language === "ka" ? "მოქმედებები" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE9]">
                  {products
                    ?.filter((product: any) => {
                      // Apply search filter
                      if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        if (
                          !product.nameEn.toLowerCase().includes(q) &&
                          !product.nameKa.toLowerCase().includes(q)
                        ) {
                          return false;
                        }
                      }
                      // Apply availability filter
                      if (filterAvailability !== "all") {
                        if (
                          filterAvailability === "available" &&
                          !product.isAvailable
                        )
                          return false;
                        if (
                          filterAvailability === "unavailable" &&
                          product.isAvailable
                        )
                          return false;
                      }
                      // Apply category filter
                      if (
                        filterCategory &&
                        product.categoryId !== filterCategory
                      )
                        return false;
                      return true;
                    })
                    .map((product: any) => (
                      <React.Fragment key={product.id}>
                        <tr className="hover:bg-[#FAFAF8] transition-colors">
                          <td className="px-4 py-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E8E4DF] flex-shrink-0">
                              <FlowerImage
                                src={product.imageUrl}
                                alt={
                                  language === "ka"
                                    ? product.nameKa
                                    : product.nameEn
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1C1917]">
                            {language === "ka"
                              ? product.nameKa
                              : product.nameEn}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#666]">
                            {product.category?.nameEn}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#C4603A] font-medium">
                            {product.priceOnRequest
                              ? language === "ka"
                                ? "ფასი მოთხოვნით"
                                : "On Request"
                              : `₾${product.priceMin}${product.priceMax && product.priceMax !== product.priceMin ? `–${product.priceMax}` : ""}`}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleToggleAvailability(product)
                                }
                                className={`text-xs px-2 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                                  product.isAvailable
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                }`}
                              >
                                {product.isAvailable
                                  ? language === "ka"
                                    ? "✓ მარაგშია"
                                    : "✓ In Stock"
                                  : language === "ka"
                                    ? "✗ მარაგში არ არის"
                                    : "✗ Out of Stock"}
                              </button>
                              <button
                                onClick={() => handleToggleFeatured(product)}
                                className={
                                  product.featured
                                    ? "text-xs bg-[#C4603A] text-white px-2 py-1 rounded-full font-medium hover:bg-[#B84A2F] transition-colors cursor-pointer"
                                    : "text-xs text-[#AAA] hover:text-[#1C1917] transition-colors cursor-pointer"
                                }
                              >
                                {product.featured
                                  ? language === "ka"
                                    ? "პოპულარული"
                                    : "Featured"
                                  : "–"}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setIsCreateMode(false);
                                  setSelectedProduct(product);
                                  setIsProductDrawerOpen(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Inline Editor Row - Desktop */}
                        {inlineEditingId === product.id && (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 bg-[#FAFAF8]">
                              <ProductFormModern
                                editingId={product.id}
                                onClose={closeInlineEditor}
                                language={language}
                              />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  {!products?.filter((product: any) => {
                    if (searchQuery) {
                      const q = searchQuery.toLowerCase();
                      if (
                        !product.nameEn.toLowerCase().includes(q) &&
                        !product.nameKa.toLowerCase().includes(q)
                      ) {
                        return false;
                      }
                    }
                    if (filterAvailability !== "all") {
                      if (
                        filterAvailability === "available" &&
                        !product.isAvailable
                      )
                        return false;
                      if (
                        filterAvailability === "unavailable" &&
                        product.isAvailable
                      )
                        return false;
                    }
                    if (filterCategory && product.categoryId !== filterCategory)
                      return false;
                    return true;
                  }).length && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-[#888]"
                      >
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        {language === "ka"
                          ? "პროდუქტები ჯერ არ არის"
                          : "No products yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Products Cards - Mobile only */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {products?.map((product: any) => (
                <div key={product.id}>
                  <div className="bg-white p-4 rounded-lg border border-[#E8E4DF] shadow-sm">
                    {/* Product Image */}
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-[#E8E4DF] mb-3 flex-shrink-0">
                      <FlowerImage
                        src={product.imageUrl}
                        alt={
                          language === "ka" ? product.nameKa : product.nameEn
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Name with Featured Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#1C1917] text-sm flex-1">
                        {language === "ka" ? product.nameKa : product.nameEn}
                      </h3>
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={
                          product.featured
                            ? "text-xs bg-[#C4603A] text-white px-2 py-1 rounded-full font-medium hover:bg-[#B84A2F] transition-colors cursor-pointer"
                            : "text-xs text-[#AAA] hover:text-[#1C1917] transition-colors cursor-pointer"
                        }
                      >
                        {product.featured
                          ? language === "ka"
                            ? "პოპულარული"
                            : "Featured"
                          : "–"}
                      </button>
                    </div>

                    {/* Category */}
                    <p className="text-xs text-[#666] mb-2">
                      {product.category?.nameEn}
                    </p>

                    {/* Price */}
                    <p className="text-sm text-[#C4603A] font-medium mb-3">
                      {product.priceOnRequest
                        ? language === "ka"
                          ? "ფასი მოთხოვნით"
                          : "On Request"
                        : `₾${product.priceMin}${product.priceMax && product.priceMax !== product.priceMin ? `–${product.priceMax}` : ""}`}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleToggleAvailability(product)}
                        className={`flex-1 min-w-[120px] p-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm font-medium ${
                          product.isAvailable
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                        }`}
                      >
                        {product.isAvailable
                          ? language === "ka"
                            ? "✓ მარაგშია"
                            : "✓ In Stock"
                          : language === "ka"
                            ? "✗ მარაგში არ არის"
                            : "✗ Out of Stock"}
                      </button>
                      <button
                        onClick={() => toggleInlineEditor(product.id)}
                        className="flex-1 min-w-[100px] p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        {inlineEditingId === product.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <Edit2 className="w-4 h-4" />
                        )}
                        {language === "ka" ? "რედაქტირება" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 min-w-[80px] p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        {language === "ka" ? "წაშლა" : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* Inline Editor - Mobile */}
                  {inlineEditingId === product.id && (
                    <div className="bg-white p-4 rounded-lg border border-[#E8E4DF] shadow-sm mt-2">
                      <InlineProductEditor
                        product={product}
                        categories={categories || []}
                        onClose={closeInlineEditor}
                        onSave={() => {
                          refetchProducts();
                          closeInlineEditor();
                        }}
                        language={language}
                      />
                    </div>
                  )}
                </div>
              ))}
              {!products?.length && (
                <div className="bg-white p-8 rounded-lg border border-[#E8E4DF] text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-[#888]">
                    {language === "ka"
                      ? "პროდუქტები ჯერ არ არის"
                      : "No products yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Categories Tab ── */}
        {activeTab === "categories" && (
          <div>
            <h2 className="text-2xl font-bold text-[#1C1917] mb-4">
              {language === "ka" ? "კატეგორიების მართვა" : "Manage Categories"}
            </h2>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto bg-[#A16207] hover:bg-[#8B4D05] text-white flex items-center justify-center gap-2 mb-6"
            >
              <Plus className="w-4 h-4" />
              {language === "ka" ? "+ ახალი კატეგორია" : "+ New Category"}
            </Button>
            {showForm && (
              <div className="bg-white p-6 rounded-xl mb-6 border border-[#E8E4DF] shadow-sm">
                <CategoryForm
                  onClose={() => {
                    setShowForm(false);
                  }}
                  language={language}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories?.map((cat: any) => (
                <div
                  key={cat.id}
                  className="bg-white p-4 rounded-lg border border-[#E8E4DF] shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-[#1C1917]">
                      {cat.nameEn}
                    </h3>
                    <p className="text-sm text-[#666]">{cat.nameKa}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === "orders" && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {language === "ka" ? "ჩატვირთვა..." : "Loading..."}
            </p>
          </div>
        )}

        {/* ── Banners Tab ── */}
        {activeTab === "banners" && (
          <div>
            <h2 className="text-2xl font-bold text-[#1C1917] mb-4">
              {language === "ka" ? "ბანერების მართვა" : "Manage Banners"}
            </h2>
            <p className="text-[#666]">
              {language === "ka"
                ? "ბანერების მართვის ფუნქცია მალე დაემატება."
                : "Banner management coming soon"}
            </p>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === "settings" && (
          <AdminSettings language={language} t={t} />
        )}

        {/* Product Edit Drawer */}
        <ProductEditDrawer
          isOpen={isProductDrawerOpen}
          onClose={() => {
            setIsProductDrawerOpen(false);
            setSelectedProduct(null);
            setHasUnsavedChanges(false);
          }}
          product={selectedProduct}
          categories={categories || []}
          isCreateMode={isCreateMode}
          onSave={() => {
            refetchProducts();
          }}
        />
      </div>
    </div>
  );
}

// Inline Product Editor Component
function InlineProductEditor({
  product,
  categories,
  onClose,
  onSave,
  language,
}: any) {
  const [nameEn, setNameEn] = useState(product.nameEn || "");
  const [nameKa, setNameKa] = useState(product.nameKa || "");
  const [descriptionEn, setDescriptionEn] = useState(
    product.descriptionEn || ""
  );
  const [descriptionKa, setDescriptionKa] = useState(
    product.descriptionKa || ""
  );
  const [categoryId, setCategoryId] = useState(
    String(product.categoryId || "")
  );
  const [priceMin, setPriceMin] = useState(String(product.priceMin || ""));
  const [priceMax, setPriceMax] = useState(String(product.priceMax || ""));
  const [priceOnRequest, setPriceOnRequest] = useState(
    product.priceOnRequest || false
  );
  const [unitType, setUnitType] = useState(product.unitType || "single stem");
  const [imageUrl, setImageUrl] = useState(product.imageUrl || null);
  const [isAvailable, setIsAvailable] = useState(product.isAvailable !== false);
  const [featured, setFeatured] = useState(product.featured || false);
  const [variants, setVariants] = useState<any[]>(product.variants || []);

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success(
        language === "ka" ? "პროდუქტი განახლდა" : "Product updated"
      );
      onSave();
    },
    onError: err => toast.error(err.message || "Error"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nameEn,
      nameKa,
      descriptionEn,
      descriptionKa,
      categoryId: parseInt(categoryId),
      priceMin: priceOnRequest ? null : parseInt(priceMin) || null,
      priceMax: priceOnRequest ? null : parseInt(priceMax) || null,
      priceOnRequest,
      unitType,
      imageUrl: imageUrl || null,
      isAvailable,
      featured,
      variants,
    };
    await updateMutation.mutateAsync({ id: product.id, ...payload });
  };

  const isLoading = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Availability Toggle */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20">
        <input
          type="checkbox"
          id="inline-isAvailable"
          checked={isAvailable}
          onChange={e => setIsAvailable(e.target.checked)}
          className="w-4 h-4 rounded border-[#E8E4DF] cursor-pointer"
        />
        <label
          htmlFor="inline-isAvailable"
          className="text-sm font-medium text-[#1C1917] cursor-pointer flex-1"
        >
          {isAvailable
            ? language === "ka"
              ? "✓ ხელმისაწვდომია"
              : "✓ Available"
            : language === "ka"
              ? "✗ მარაგში არ არის"
              : "✗ Unavailable"}
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name English */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "სახელი (ინგლისურად)" : "Name (English)"}
          </label>
          <input
            type="text"
            value={nameEn}
            onChange={e => setNameEn(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
            required
          />
        </div>

        {/* Name Georgian */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "სახელი (ქართულად)" : "Name (Georgian)"}
          </label>
          <input
            type="text"
            value={nameKa}
            onChange={e => setNameKa(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
            required
          />
        </div>

        {/* Description English */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka"
              ? "აღწერა (ინგლისურად)"
              : "Description (English)"}
          </label>
          <textarea
            value={descriptionEn}
            onChange={e => setDescriptionEn(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] resize-none"
            rows={3}
          />
        </div>

        {/* Description Georgian */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "აღწერა (ქართულად)" : "Description (Georgian)"}
          </label>
          <textarea
            value={descriptionKa}
            onChange={e => setDescriptionKa(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] resize-none"
            rows={3}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "კატეგორია" : "Category"}
          </label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
            required
          >
            <option value="">
              {language === "ka" ? "აირჩიეთ კატეგორია" : "Select Category"}
            </option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Type */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "საზომი ერთეული" : "Unit Type"}
          </label>
          <input
            type="text"
            value={unitType}
            onChange={e => setUnitType(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
          />
        </div>

        {/* Price Min */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "მინიმალური ფასი" : "Min Price"}
          </label>
          <input
            type="number"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            disabled={priceOnRequest}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] disabled:bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8]"
          />
        </div>

        {/* Price Max */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "მაქსიმალური ფასი" : "Max Price"}
          </label>
          <input
            type="number"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            disabled={priceOnRequest}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] disabled:bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8]"
          />
        </div>
      </div>

      {/* Price on Request */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="priceOnRequest"
          checked={priceOnRequest}
          onChange={e => setPriceOnRequest(e.target.checked)}
          className="w-4 h-4 rounded border-[#E8E4DF]"
        />
        <label
          htmlFor="priceOnRequest"
          className="text-sm font-medium text-[#1C1917]"
        >
          {language === "ka" ? "ფასი მოთხოვნით" : "Price on Request"}
        </label>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={e => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded border-[#E8E4DF]"
        />
        <label
          htmlFor="featured"
          className="text-sm font-medium text-[#1C1917]"
        >
          {language === "ka" ? "მთავარ გვერდზე ჩვენება" : "Show on Homepage"}
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-[#1C1917] mb-2">
          {language === "ka" ? "პროდუქტის სურათი" : "Product Image"}
        </label>
        <ImageUploader
          onChange={(url: string | null) => setImageUrl(url)}
          value={imageUrl}
        />
      </div>

      {/* Color Variants */}
      <VariantEditor
        variants={variants}
        onAddVariant={variant =>
          setVariants([
            ...variants,
            { ...variant, id: Math.random().toString(36).substr(2, 9) },
          ])
        }
        onUpdateVariant={(id, updates) =>
          setVariants(
            variants.map(v => (v.id === id ? { ...v, ...updates } : v))
          )
        }
        onDeleteVariant={id => setVariants(variants.filter(v => v.id !== id))}
      />

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-[#A16207] hover:bg-[#8B4D05] text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading
            ? language === "ka"
              ? "ინახება..."
              : "Saving..."
            : language === "ka"
              ? "შენახვა"
              : "Save"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-[#E8E4DF] text-[#1C1917] rounded-lg hover:bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8] transition-colors"
        >
          {language === "ka" ? "გაუქმება" : "Cancel"}
        </button>
      </div>
    </form>
  );
}

// Category Form Component
function CategoryForm({ onClose, language }: any) {
  const [nameEn, setNameEn] = useState("");
  const [nameKa, setNameKa] = useState("");
  const [validationError, setValidationError] = useState("");

  // Auto-generate slug from nameEn (English name)
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-")
      .trim();
  };

  const slug = generateSlug(nameEn);
  const { data: categories } = trpc.categories.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      utils.categories.list.invalidate();
      toast.success(
        language === "ka" ? "კატეგორია შეიქმნა" : "Category created"
      );
      onClose();
    },
    onError: err => toast.error(err.message || "Error"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validation
    if (!nameEn.trim()) {
      setValidationError(
        language === "ka"
          ? "ინგლისური სახელის მითითება აუცილებელია"
          : "English name is required"
      );
      return;
    }
    if (!nameKa.trim()) {
      setValidationError(
        language === "ka"
          ? "ქართული სახელის მითითება აუცილებელია"
          : "Georgian name is required"
      );
      return;
    }
    if (!slug) {
      setValidationError(
        language === "ka"
          ? "სლაგი ვერ გენერირდა"
          : "Slug could not be generated"
      );
      return;
    }

    // Check for duplicate slug
    if (categories?.some((cat: any) => cat.slug === slug)) {
      setValidationError(
        language === "ka"
          ? "ეს სლაგი უკვე გამოიყენება"
          : "This slug already exists"
      );
      return;
    }

    await createMutation.mutateAsync({ nameEn, nameKa, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "სახელი (ინგლისურად)" : "Name (English)"}
          </label>
          <input
            type="text"
            value={nameEn}
            onChange={e => setNameEn(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1">
            {language === "ka" ? "სახელი (ქართულად)" : "Name (Georgian)"}
          </label>
          <input
            type="text"
            value={nameKa}
            onChange={e => setNameKa(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C1917] mb-1">
          {language === "ka" ? "URL-სლაგი (ავტომატურად)" : "URL Slug (Auto)"}
        </label>
        <input
          type="text"
          value={slug}
          disabled
          className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8] text-[#888] focus:outline-none"
        />
      </div>
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {validationError}
        </div>
      )}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={
            createMutation.isPending ||
            !slug ||
            !nameEn.trim() ||
            !nameKa.trim()
          }
          className="flex-1 px-4 py-2 bg-[#A16207] hover:bg-[#8B4D05] text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {createMutation.isPending
            ? language === "ka"
              ? "ინახება..."
              : "Saving..."
            : language === "ka"
              ? "შენახვა"
              : "Save"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-[#E8E4DF] text-[#1C1917] rounded-lg hover:bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8] transition-colors"
        >
          {language === "ka" ? "გაუქმება" : "Cancel"}
        </button>
      </div>
    </form>
  );
}

// Product Form Component (for creating new products)
// Old ProductForm component - replaced by ProductFormModern
function ProductForm_OLD({ editingId, onClose, language }: any) {
  const [nameEn, setNameEn] = useState("");
  const [nameKa, setNameKa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionKa, setDescriptionKa] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [unitType, setUnitType] = useState("single stem");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);

  const [loaded, setLoaded] = useState(false);
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: existingProduct } = trpc.products.byId.useQuery(
    { id: editingId! },
    { enabled: editingId !== null }
  );
  const utils = trpc.useUtils();
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      onClose();
      toast.success(language === "ka" ? "პროდუქტი შეიქმნა" : "Product created");
    },
    onError: err => toast.error(err.message || "Error"),
  });
  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      onClose();
      toast.success(
        language === "ka" ? "პროდუქტი განახლდა" : "Product updated"
      );
    },
    onError: err => toast.error(err.message || "Error"),
  });
  // Load existing product data when editing
  useEffect(() => {
    if (editingId !== null && existingProduct && !loaded) {
      setNameEn(existingProduct.nameEn || "");
      setNameKa(existingProduct.nameKa || "");
      setDescriptionEn(existingProduct.descriptionEn || "");
      setDescriptionKa(existingProduct.descriptionKa || "");
      setCategoryId(String(existingProduct.categoryId || ""));
      setPriceMin(String(existingProduct.priceMin || ""));
      setPriceMax(String(existingProduct.priceMax || ""));
      setPriceOnRequest(existingProduct.priceOnRequest || false);
      setUnitType(existingProduct.unitType || "single stem");
      setImageUrl(existingProduct.imageUrl || null);
      setIsAvailable(existingProduct.isAvailable !== false);
      setFeatured(existingProduct.featured || false);
      setVariants(existingProduct.variants || []);
      setLoaded(true);
    }
    if (editingId === null && !loaded) {
      setLoaded(true);
    }
  }, [editingId, existingProduct, loaded]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nameEn,
      nameKa,
      descriptionEn,
      descriptionKa,
      categoryId: parseInt(categoryId),
      priceMin: priceOnRequest ? null : parseInt(priceMin) || null,
      priceMax: priceOnRequest ? null : parseInt(priceMax) || null,
      priceOnRequest,
      unitType,
      isAvailable,
      featured,
      imageUrl: imageUrl || null,
      variants,
    };
    if (editingId !== null) {
      await updateMutation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEdit = editingId !== null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#1C1917] mb-4">
        {isEdit
          ? language === "ka"
            ? "პროდუქტის რედაქტირება"
            : "Edit Product"
          : language === "ka"
            ? "ახალი პროდუქტი"
            : "New Product"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka" ? "სახელი (ინგლისურად)" : "Name (English)"}
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={e => setNameEn(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka" ? "სახელი (ქართულად)" : "Name (Georgian)"}
            </label>
            <input
              type="text"
              value={nameKa}
              onChange={e => setNameKa(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka"
                ? "აღწერა (ინგლისურად)"
                : "Description (English)"}
            </label>
            <textarea
              value={descriptionEn}
              onChange={e => setDescriptionEn(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka"
                ? "აღწერა (ქართულად)"
                : "Description (Georgian)"}
            </label>
            <textarea
              value={descriptionKa}
              onChange={e => setDescriptionKa(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka" ? "კატეგორია" : "Category"}
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
              required
            >
              <option value="">
                {language === "ka" ? "აირჩიეთ კატეგორია" : "Select Category"}
              </option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka" ? "საზომი ერთეული" : "Unit Type"}
            </label>
            <input
              type="text"
              value={unitType}
              onChange={e => setUnitType(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka" ? "მინიმალური ფასი" : "Min Price"}
            </label>
            <input
              type="number"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              disabled={priceOnRequest}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] disabled:bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1">
              {language === "ka" ? "მაქსიმალური ფასი" : "Max Price"}
            </label>
            <input
              type="number"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              disabled={priceOnRequest}
              className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] disabled:bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="priceOnRequest"
            checked={priceOnRequest}
            onChange={e => setPriceOnRequest(e.target.checked)}
            className="w-4 h-4 rounded border-[#E8E4DF]"
          />
          <label
            htmlFor="priceOnRequest"
            className="text-sm font-medium text-[#1C1917]"
          >
            {language === "ka" ? "ფასი მოთხოვნით" : "Price on Request"}
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-[#E8E4DF]"
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-[#1C1917]"
          >
            {language === "ka" ? "მთავარ გვერდზე ჩვენება" : "Show on Homepage"}
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-2">
            {language === "ka" ? "პროდუქტის სურათი" : "Product Image"}
          </label>
          <ImageUploader
            onChange={(url: string | null) => setImageUrl(url)}
            value={imageUrl}
          />
        </div>
        <VariantEditor
          variants={variants}
          onAddVariant={variant =>
            setVariants([
              ...variants,
              { ...variant, id: Math.random().toString(36).substr(2, 9) },
            ])
          }
          onUpdateVariant={(id, updates) =>
            setVariants(
              variants.map(v => (v.id === id ? { ...v, ...updates } : v))
            )
          }
          onDeleteVariant={id => setVariants(variants.filter(v => v.id !== id))}
        />
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#A16207] hover:bg-[#8B4D05] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading
              ? language === "ka"
                ? "ინახება..."
                : "Saving..."
              : language === "ka"
                ? "შენახვა"
                : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#E8E4DF] text-[#1C1917] rounded-lg hover:bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8] transition-colors"
          >
            {language === "ka" ? "გაუქმება" : "Cancel"}
          </button>
        </div>
      </form>
    </div>
  );
}

import React from "react";

// Admin Settings Component
function AdminSettings({ language, t }: any) {
  const [metaCapiEnabled, setMetaCapiEnabled] = React.useState(true);
  const [saveStatus, setSaveStatus] = React.useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const handleToggleMetaCapi = async () => {
    setSaveStatus("saving");
    try {
      // In a real app, this would call an API endpoint to update the setting
      // For now, we'll just toggle the state and show a success message
      setMetaCapiEnabled(!metaCapiEnabled);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1C1917] mb-6">
        {language === "ka" ? "პარამეტრები" : "Settings"}
      </h2>

      {/* Meta Conversions API Section */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-6 mb-6 max-w-2xl">
        <h3 className="text-xl font-bold text-[#1C1917] mb-4">
          {language === "ka" ? "Meta Conversions API" : "Meta Conversions API"}
        </h3>

        <div className="space-y-4">
          <p className="text-[#666] text-sm">
            {language === "ka"
              ? "მართეთ Meta Conversions API-ის თვალის დევნება. ჩართვის შემთხვევაში ვებსაიტის მოვლენები (PageView, ViewContent, AddToCart და სხვა) სერვერიდან გაეგზავნება Meta-ს."
              : "Control Meta Conversions API tracking. When enabled, website events (PageView, ViewContent, AddToCart, etc.) are sent to Meta from the server side."}
          </p>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#A16207]/10 to-[#EC4899]/10 rounded-2xl border border-[#A16207]/20">
            <div>
              <p className="font-semibold text-[#1C1917]">
                {language === "ka"
                  ? "Conversions API ტრეკინგი"
                  : "Conversions API Tracking"}
              </p>
              <p className="text-sm text-[#666] mt-1">
                {language === "ka"
                  ? "Meta-ს მოვლენების სერვერული თვალის დევნება"
                  : "Server-side event tracking to Meta"}
              </p>
            </div>
            <button
              onClick={handleToggleMetaCapi}
              disabled={saveStatus === "saving"}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                metaCapiEnabled
                  ? "bg-gradient-to-r from-[#A16207] to-[#EC4899] text-white hover:shadow-lg"
                  : "bg-[#E8E4DF] text-[#666] hover:bg-[#D8D4CF]"
              } disabled:opacity-50`}
            >
              {saveStatus === "saving"
                ? language === "ka"
                  ? "განახლება მიმდინარეობს..."
                  : "Saving..."
                : metaCapiEnabled
                  ? language === "ka"
                    ? "ჩართული"
                    : "Enabled"
                  : language === "ka"
                    ? "გამორთული"
                    : "Disabled"}
            </button>
          </div>

          {/* Status Message */}
          {saveStatus === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {language === "ka"
                ? "პარამეტრი განახლდა"
                : "Setting updated successfully"}
            </div>
          )}
          {saveStatus === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {language === "ka"
                ? "შეცდომა პარამეტრის განახლებისას"
                : "Error updating setting"}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-2xl">
        <p className="text-sm text-blue-900">
          <strong>{language === "ka" ? "შენიშვნა:" : "Note:"}</strong>{" "}
          {language === "ka"
            ? "ეს პარამეტრი მართავს მხოლოდ Conversions API-ის სერვერულ თვალის დევნებას. ბრაუზერში Meta Pixel-ის თვალის დევნება ყოველთვის აქტიურია."
            : "This setting controls only server-side Conversions API tracking. Browser-side Meta Pixel tracking is always active."}
        </p>
      </div>
    </div>
  );
}
