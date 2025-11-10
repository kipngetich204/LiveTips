// ===================================
// ENUMS & TYPES
// ===================================

export const UserRole = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
  GUEST: "guest"
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserType = {
  BASIC: "basic",
  PREMIUM: "premium",
  ENTERPRISE: "enterprise",
  TRIAL: "trial"
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING_VERIFICATION: "pending_verification",
  DELETED: "deleted"
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export const PaymentStatus = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled"
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentMethod = {
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  PAYPAL: "paypal",
  STRIPE: "stripe",
  BANK_TRANSFER: "bank_transfer",
  CRYPTO: "crypto"
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const NotificationType = {
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
  IN_APP: "in_app"
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

// ===================================
// INTERFACES
// ===================================

export interface PaymentHistory {
  id: string;
  transactionId: string;
  date: string; // ISO 8601 timestamp
  amount: number;
  currency: string; // ISO 4217 currency code (USD, EUR, GBP)
  status: PaymentStatus;
  method: PaymentMethod;
  description?: string;
  invoiceUrl?: string;
  metadata?: Record<string, any>;
}

export interface LoginHistory {
  id: string;
  timestamp: string; // ISO 8601 timestamp
  device: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  userAgent?: string;
  success: boolean; // Track failed attempts
  failureReason?: string;
}

export interface NotificationPreferences {
  [NotificationType.EMAIL]: boolean;
  [NotificationType.SMS]: boolean;
  [NotificationType.PUSH]: boolean;
  [NotificationType.IN_APP]: boolean;
  marketing: boolean;
  newsletter: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string; // ISO 639-1 language code
  timezone: string; // IANA timezone (e.g., "America/New_York")
  dateFormat: string; // e.g., "MM/DD/YYYY" or "DD/MM/YYYY"
  currency: string; // Preferred currency for display
  notifications: NotificationPreferences;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: "app" | "sms" | "email";
  twoFactorSecret?: string; // Encrypted TOTP secret
  backupCodes?: string[]; // Hashed backup codes
  passwordLastChanged: string; // ISO timestamp
  failedLoginAttempts: number;
  lastFailedLogin?: string;
  accountLockedUntil?: string; // Temporary lock after failed attempts
  trustedDevices?: string[]; // Device fingerprint hashes
  sessionTimeout: number; // Minutes until auto-logout
}

export interface SubscriptionDetails {
  plan: UserType;
  startDate: string;
  expiresAt?: string;
  autoRenew: boolean;
  cancelledAt?: string;
  features: string[]; // List of enabled features
  usageLimit?: {
    requests?: number;
    storage?: number; // In bytes
    bandwidth?: number; // In bytes
  };
  usageCurrent?: {
    requests?: number;
    storage?: number;
    bandwidth?: number;
  };
}

export interface UserMetadata {
  source?: string; // Registration source (organic, referral, ads)
  referralCode?: string; // User's own referral code
  referredBy?: string; // UUID of referring user
  tags?: string[]; // Custom tags for segmentation
  customFields?: Record<string, any>; // Flexible additional data
  notes?: string; // Admin notes
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string; // ISO 3166-1 alpha-2 country code
  countryCode?: string;
  isDefault?: boolean;
}

// ===================================
// MAIN USER INTERFACE
// ===================================

export interface User {
  // Core Identity
  uuid: string;
  username: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  phone?: string;
  phoneVerified?: boolean;
  phoneVerifiedAt?: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  displayName?: string; // Optional public display name
  avatarUrl?: string | null;
  bio?: string;
  birthday?: string; // ISO date (YYYY-MM-DD)
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  
  // Location
  addresses?: Address[];
  timezone?: string;
  
  // Authentication (NEVER store plaintext password)
  passwordHash: string; // bcrypt/argon2 hashed password
  passwordSalt?: string; // If using manual salting
  
  // Authorization & Access
  role: UserRole;
  permissions?: string[]; // Granular permissions array
  type: UserType;
  status: UserStatus;
  
  // Subscription & Billing
  subscription?: SubscriptionDetails;
  
  // Timestamps
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  deletedAt?: string | null; // Soft delete support
  
  // Preferences & Settings
  preferences: UserPreferences;
  security: SecuritySettings;
  
  // History & Analytics
  history: {
    payments: PaymentHistory[];
    logins: LoginHistory[];
  };
  
  // Compliance & Legal
  agreedToTermsAt?: string;
  agreedToPrivacyAt?: string;
  termsVersion?: string;
  privacyVersion?: string;
  gdprConsent?: boolean;
  dataProcessingConsent?: boolean;
  
  // Metadata
  metadata: UserMetadata;
  
  // Session Management
  activeSessionIds?: string[]; // Track active sessions for multi-device logout
}



// ===================================
// HELPER TYPES
// ===================================

// For API responses - exclude sensitive fields
export type UserPublic = Omit<User, 
  'passwordHash' | 
  'passwordSalt' | 
  'security' | 
  'history' | 
  'activeSessionIds'
> & {
  // Include only safe security info
  twoFactorEnabled: boolean;
};

// For user list/search results
export type UserSummary = Pick<User, 
  'uuid' | 
  'username' | 
  'email' | 
  'firstName' | 
  'lastName' | 
  'avatarUrl' | 
  'role' | 
  'type' | 
  'status' | 
  'createdAt' | 
  'lastLoginAt'
>;

// For JWT payload
export type TokenPayload = {
  uuid: string;
  email: string;
  role: UserRole;
  type: UserType;
  sessionId: string;
  iat: number;
  exp: number;
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

export const UserUtils = {
  // Check if user has specific permission
  hasPermission: (user: User, permission: string): boolean => {
    if (user.role === UserRole.SUPER_ADMIN) return true;
    return user.permissions?.includes(permission) ?? false;
  },

  // Check if user subscription is active
  isSubscriptionActive: (user: User): boolean => {
    if (!user.subscription) return false;
    if (!user.subscription.expiresAt) return true;
    return new Date(user.subscription.expiresAt) > new Date();
  },

  // Get user's full name
  getFullName: (user: User): string => {
    return `${user.firstName} ${user.lastName}`.trim();
  },

  // Check if account is locked
  isAccountLocked: (user: User): boolean => {
    if (!user.security.accountLockedUntil) return false;
    return new Date(user.security.accountLockedUntil) > new Date();
  },

  // Sanitize user data for public API
  toPublic: (user: User): UserPublic => {
    const { passwordHash, passwordSalt, security, history, activeSessionIds, ...publicData } = user;
    return {
      ...publicData,
      twoFactorEnabled: security.twoFactorEnabled
    };
  },

  // Convert to summary format
  toSummary: (user: User): UserSummary => {
    return {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      type: user.type,
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };
  }
};

// ===================================
// DATABASE INDEXES (for reference)
// ===================================

/**
 * Recommended database indexes:
 * 
 * - uuid (PRIMARY KEY, UNIQUE)
 * - email (UNIQUE)
 * - username (UNIQUE)
 * - status (for filtering active users)
 * - role (for role-based queries)
 * - type (for subscription queries)
 * - createdAt (for sorting/pagination)
 * - lastLoginAt (for activity tracking)
 * - deletedAt (for soft delete queries)
 * - subscription.expiresAt (for expiration checks)
 * - metadata.referredBy (for referral tracking)
 * 
 * Compound indexes:
 * - (status, type) for subscription management
 * - (role, status) for user management
 * - (deletedAt, status) for soft delete filtering
 */