import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

// better-auth required: user table
// Custom fields: role (admin role support), lastName, firstName, birthYear, address (profile data)
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  lastName: text("last_name"),
  firstName: text("first_name"),
  birthYear: integer("birth_year"),
  address: text("address"),
  profileCompleted: integer("profile_completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// better-auth required: session table
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// better-auth required: account table
export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// better-auth required: verification table (for OTP codes)
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Event table (per D-01)
export const event = sqliteTable("event", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  venue: text("venue").notNull().default("DOPAMIN, Budapest"),
  description: text("description"),
  genreTags: text("genre_tags"), // comma-separated: "UK Garage,Club Trance" per D-02
  imageUrl: text("image_url"),
  createdBy: text("created_by").notNull().references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Registration table (per D-03)
export const registration = sqliteTable("registration", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  qrToken: text("qr_token").notNull(), // HMAC-signed token per D-13
  status: text("status", { enum: ["registered", "cancelled"] }).notNull().default("registered"),
  isFree: integer("is_free", { mode: "boolean" }).notNull().default(false), // for Phase 3 loyalty
  checkedInAt: integer("checked_in_at", { mode: "timestamp" }), // for Phase 3 check-in
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  unique().on(table.eventId, table.userId), // per D-04, REGN-04
]);
