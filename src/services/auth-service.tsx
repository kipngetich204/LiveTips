import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
  type UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../FirebaseConfig/firebase';
import type { User, UserSession } from '../types/user';

export class AuthService {
  private static sessionInterval: ReturnType<typeof setInterval> | null = null;

  // Convert Firebase User to our User interface
  static async convertFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    return {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || firebaseUser.email?.charAt(0).toUpperCase() || 'U',
      photoURL: firebaseUser.photoURL || undefined,
      isAdmin: userData.isAdmin || false,
      emailVerified: firebaseUser.emailVerified,
      provider: firebaseUser.providerData[0]?.providerId.includes('google') ? 'google' : 'email',
      createdAt: userData.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      sessionDuration: userData.sessionDuration || 0,
      type: userData.type || 'basic'
    };
  }

  // Save/Update user in Firestore
  static async saveUserToFirestore(user: User): Promise<void> {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userDocRef, {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        photoURL: user.photoURL,
        lastLoginAt: serverTimestamp(),
        emailVerified: user.emailVerified
      });
    } else {
      // Create new user
      await setDoc(userDocRef, {
        uid: user.uid,
        name:user.name,
        email: user.email,
        avatar: user.avatar,
        photoURL: user.photoURL,
        isAdmin: false,
        emailVerified: user.emailVerified,
        provider: user.provider,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        sessionDuration: 0
      });
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<User> {
    try {
      // Configure auth settings
      auth.useDeviceLanguage();
      
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = await this.convertFirebaseUser(result.user);
      await this.saveUserToFirestore(user);
      await this.startSession(user.uid);
      return user;
    } catch (error: any) {
      // Check if the error is related to popup being blocked or closed
      if (error.code === 'auth/popup-blocked') {
        throw new Error('The sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('The sign-in was cancelled. Please try again.');
      } else {
        throw new Error(this.handleAuthError(error));
      }
    }
  }

  // Sign in with Email and Password
  static async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await this.convertFirebaseUser(result.user);
      await this.saveUserToFirestore(user);
      await this.startSession(user.uid);
      return user;
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Sign up with Email and Password
  static async signUpWithEmail(email: string, password: string): Promise<User> {
    try {
      const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(result.user, {
        displayName: result.user.email
      });

      const user = await this.convertFirebaseUser(result.user);
      await this.saveUserToFirestore(user);
      await this.startSession(user.uid);
      return user;
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Reset Password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Sign Out
  static async signOut(): Promise<void> {
    try {
      if (auth.currentUser) {
        await this.endSession(auth.currentUser.uid);
      }
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Start tracking user session
  static async startSession(uid: string): Promise<void> {
    const sessionRef = doc(db, 'sessions', uid);
    const sessionStart = Date.now();

    await setDoc(sessionRef, {
      uid,
      sessionStart,
      lastActivity: sessionStart,
      isActive: true
    });

    // Update last activity every 30 seconds
    this.sessionInterval = setInterval(async () => {
      await this.updateActivity(uid);
    }, 30000); // 30 seconds
  }

  // Update last activity timestamp
  static async updateActivity(uid: string): Promise<void> {
    const sessionRef = doc(db, 'sessions', uid);
    await updateDoc(sessionRef, {
      lastActivity: Date.now()
    });
  }

  // End session and calculate total duration
  static async endSession(uid: string): Promise<void> {
    if (this.sessionInterval) {
      clearInterval(this.sessionInterval);
      this.sessionInterval = null;
    }

    const sessionRef = doc(db, 'sessions', uid);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data() as UserSession;
      const sessionEnd = Date.now();
      const duration = Math.floor((sessionEnd - sessionData.sessionStart) / 1000); // in seconds

      // Update session status
      await updateDoc(sessionRef, {
        isActive: false,
        sessionEnd,
        duration
      });

      // Update total session duration in user document
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentDuration = userDoc.data().sessionDuration || 0;
        await updateDoc(userRef, {
          sessionDuration: currentDuration + duration
        });
      }
    }
  }

  // Get total session time for user
  static async getTotalSessionTime(uid: string): Promise<number> {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().sessionDuration || 0;
    }
    return 0;
  }

  // Format session duration
  static formatSessionDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.convertFirebaseUser(firebaseUser);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // Handle Firebase Auth errors
  private static handleAuthError(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed';
      case 'auth/cancelled-popup-request':
        return 'Only one popup request is allowed at a time';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by the browser';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return error.message || 'An error occurred during authentication';
    }
  }
}