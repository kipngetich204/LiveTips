// Central place for "which prediction tiers can this user see" logic.
// Keeping it as plain functions (not React-specific) means it can be
// reused from AuthContext, from server-side/admin code, or from tests,
// without dragging React along.

export type TierKey = "basic" | "premium" | "super_premium";

export const TIER_ORDER: TierKey[] = ["basic", "premium", "super_premium"];

/**
 * Maps a raw user.type — including guests (undefined/null) or any
 * unrecognized value — down to a known tier. Guests and unknown values
 * both fall back to "basic", matching "guest === basic prediction".
 */
export function getUserTier(userType?: string | null): TierKey {
  return TIER_ORDER.includes(userType as TierKey) ? (userType as TierKey) : "basic";
}

/** Every tier the user is allowed to see: their own tier + everything below it. */
export function getAccessibleTiers(userType?: string | null): TierKey[] {
  const tier = getUserTier(userType);
  return TIER_ORDER.slice(0, TIER_ORDER.indexOf(tier) + 1);
}

/** The user's own tier — e.g. useful for deciding what's expanded by default. */
export function getPrimaryTier(userType?: string | null): TierKey {
  return getUserTier(userType);
}