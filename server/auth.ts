import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getDb } from "./db";

const SALT_ROUNDS = 10;


/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Register a new customer user
 */
export async function registerCustomer(
  name: string,
  email: string,
  phone: string,
  password: string
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if email already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Generate unique openId for native registration
  const openId = `native_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create user with valid enum role ('user')
  const result = await db.insert(users).values({
    openId,
    name,
    email,
    phone,
    passwordHash,
    loginMethod: "native",
    role: "user",
    lastSignedIn: new Date(),
  });

  // Return the created user
  const newUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return newUser[0];
}

/**
 * Login with email and password
 */
export async function loginCustomer(email: string, password: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Find user by email
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result[0];

  // Check password
  if (!user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // Update last signed in
  await db
    .update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, user.id));

  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0];
}

/**
 * Change user password
 */
export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Get user
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify old password
  if (!user.passwordHash) {
    throw new Error("Invalid password");
  }

  const isValid = await verifyPassword(oldPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await db
    .update(users)
    .set({ passwordHash: newPasswordHash })
    .where(eq(users.id, userId));

  return { success: true };
}
