import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { type User, UserStatus, UserType } from "../types/user";
import { auth, db } from "../FirebaseConfig/firebase";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { getAccessibleTiers, getPrimaryTier, getUserTier, type TierKey } from "../utils/Tieraccess ";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  /** Set when sign-in fails, the account was suspended/deleted, or the user doc failed to load. */
  authError: string | null;
  logout: () => Promise<void>;
  isAdmin: boolean;
  /** The user's own tier. Guests and unrecognized types resolve to "basic". */
  tier: TierKey;
  /** Every tier the user can see: their own tier + everything below it. */
  accessibleTiers: TierKey[];
  /** Same as `tier` — the tier that should be shown expanded by default. */
  primaryTier: TierKey;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authError: null,
  logout: async () => {},
  isAdmin: false,
  tier: "basic",
  accessibleTiers: ["basic"],
  primaryTier: "basic",
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Live-updates the signed-in user's own document, so a tier change (or a
    // suspension) made elsewhere — by an admin, a payment webhook, etc. — is
    // reflected immediately without needing to log out and back in.
    let unsubscribeUserDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribeUserDoc?.();
      unsubscribeUserDoc = undefined;

      if (!firebaseUser) {
        setUser(null);
        setAuthError(null);
        setLoading(false);
        return;
      }

      try {
        setAuthError(null);
        // Handles first-login document creation / lastLoginAt upkeep, etc.
        // The live `user` state itself is sourced from the snapshot below,
        // not this call's return value, so it stays in sync going forward.
        await AuthService.convertFirebaseUser(firebaseUser);

        unsubscribeUserDoc = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          async (snap) => {
            if (!snap.exists()) {
              setUser(null);
              setLoading(false);
              return;
            }

            const data = { uid: snap.id, ...snap.data() } as User & { isAdmin?: boolean };

            // Backward-compat: bridge documents still written in the old
            // shape (isAdmin boolean, no role/type/status) until the doc
            // creation path itself is migrated. Writes the corrected fields
            // back so each user's doc self-heals the first time they log in
            // after this change ships.
            if (data.role === undefined || data.type === undefined || data.status === undefined) {
              const migrated: Partial<User> = {
                role: data.role ?? (data.isAdmin ? "admin" : "user"),
                type: data.type ?? UserType.BASIC,
                status: data.status ?? UserStatus.ACTIVE,
              };
              Object.assign(data, migrated);
              updateDoc(doc(db, "users", firebaseUser.uid), migrated).catch((err) =>
                console.error("Failed to migrate legacy user doc:", err)
              );
            }

            if (data.status === UserStatus.SUSPENDED || data.status === UserStatus.DELETED) {
              setAuthError(
                data.status === UserStatus.SUSPENDED
                  ? "Your account has been suspended. Contact support for help."
                  : "This account no longer exists."
              );
              await AuthService.signOut();
              setUser(null);
              setLoading(false);
              return;
            }

            // Lazy downgrade once a subscription's expiry has passed. This is
            // a convenience for immediate UX only — it only fires for a
            // currently-active session, so real enforcement (e.g. someone who
            // never logs back in) still needs a scheduled server-side job.
            const expiresAt = data.subscription?.expiresAt;
            const isExpired = !!expiresAt && new Date(expiresAt) <= new Date();
            if (isExpired && data.type !== UserType.BASIC) {
              data.type = UserType.BASIC;
              updateDoc(doc(db, "users", firebaseUser.uid), { type: UserType.BASIC }).catch((err) =>
                console.error("Failed to downgrade expired subscription:", err)
              );
            }

            setUser(data);
            setLoading(false);
          },
          (err) => {
            console.error("Error listening to user document:", err);
            setAuthError("Failed to load your account data.");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Error resolving Firebase user:", err);
        setAuthError("Failed to sign you in. Please try again.");
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUserDoc?.();
    };
  }, []);

  const logout = async () => {
    try {
      await AuthService.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setUser(null);
      setAuthError(null);
      navigate("/");
    }
  };

  const isAdmin = user?.role === "admin";
  const tier = getUserTier(user?.type);
  const accessibleTiers = getAccessibleTiers(user?.type);
  const primaryTier = getPrimaryTier(user?.type);

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, logout, isAdmin, tier, accessibleTiers, primaryTier }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);