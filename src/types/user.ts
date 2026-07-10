// ===================================
// Roles, tiers, status
// ===================================

export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
// Note: there is deliberately no "guest" role stored anywhere. An
// unauthenticated visitor has no User document at all — `user === null`
// is "guest" throughout the app. tierAccess.ts already relies on this:
// a missing/unknown type resolves to the "basic" tier.

export const UserType = {
  BASIC: "basic",
  PREMIUM: "premium",
  SUPER_PREMIUM: "super_premium",
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];

export const UserStatus = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DELETED: "deleted",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export type AuthProvider = "google" | "email";

// ===================================
// Subscription — just enough to know what plan is active and when it lapses.
// Individual payment records belong in their own collection/subcollection
// (e.g. `users/{uid}/payments/{id}`), not embedded here — that list only
// grows, and embedding it forces you to read/write the whole user doc
// every time a payment happens.
// ===================================

export interface SubscriptionDetails {
  plan: UserType;
  startDate: string; // ISO 8601
  expiresAt?: string; // ISO 8601 — omit for basic (no expiry)
  autoRenew: boolean;
  cancelledAt?: string;
}

// ===================================
// Main User document — Firestore: users/{uid}
// ===================================

export interface User {
  uid: string; // Firebase Auth UID — keep as `uid`, not `uuid`, to match Firebase and the rest of the codebase
  email: string;
  emailVerified: boolean;
  name?: string;
  avatar: string;
  photoURL?: string | null; // Google profile photo, when provider === "google"
  provider: AuthProvider;

  role: UserRole;
  type: UserType;
  status: UserStatus;
  /** @deprecated Legacy mirror of `role === "admin"`, kept in sync by AuthService until all callers read `role` directly. */
  isAdmin?: boolean;

  subscription?: SubscriptionDetails | null;

  createdAt: string; // ISO 8601
  lastLoginAt: string; // ISO 8601
  sessionDuration?: number; // total seconds logged in, accumulated on logout
}

// ===================================
// Session tracking — unchanged from your current design; this was already
// correctly kept out of the User document.
// ===================================

export interface UserSession {
  uid: string;
  sessionStart: number; // timestamp
  lastActivity: number; // timestamp
  isActive: boolean;
}

// ===================================
// Helpers
// ===================================

export const UserUtils = {
  isAdmin: (user: User | null): boolean => user?.role === UserRole.ADMIN,

  isSubscriptionActive: (user: User): boolean => {
    if (!user.subscription?.expiresAt) return true; // no expiry set = active
    return new Date(user.subscription.expiresAt) > new Date();
  },

  getDisplayName: (user: User): string => user.name || user.email.split("@")[0],
};