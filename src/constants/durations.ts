export const Durations = {
  /** How long the Lit Date badge is shown after a verified date upload (ms) */
  litDateBadgeMs: 30 * 24 * 60 * 60 * 1000,
  /** How long the snuff ban lasts (ms) */
  snuffBanMs: 14 * 24 * 60 * 60 * 1000,
  /** Number of snuffs required to trigger a ban */
  snuffBanThreshold: 3,
} as const;
