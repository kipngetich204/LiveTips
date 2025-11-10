export interface User {
  uid: string; // Firebase UID
  name?:string;
  email: string;
  avatar: string;
  photoURL?: string; // Google profile photo
  isAdmin: boolean;
  emailVerified: boolean;
  provider: 'google' | 'email'; // Auth provider
  createdAt: string;
  lastLoginAt: string;
  sessionDuration?: number; // Total time logged in (seconds)
  type: 'basic' | 'premium'; // User type
}

export interface UserSession {
  uid: string;
  sessionStart: number; // Timestamp
  lastActivity: number; // Timestamp
  isActive: boolean;
}
