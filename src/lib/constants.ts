// Type-safe constants for enum-like values (SQLite doesn't support enums)

export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  BUSINESS_OWNER: "BUSINESS_OWNER",
} as const;

export const SubscriptionTier = {
  FREE: "FREE",
  PREMIUM: "PREMIUM",
} as const;

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
  TRIALING: "TRIALING",
} as const;

export const BillingCycle = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  BIANNUAL: "BIANNUAL",
  ANNUAL: "ANNUAL",
} as const;

export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELED: "CANCELED",
  REFUNDED: "REFUNDED",
} as const;

export const ImageType = {
  CUSTOM: "CUSTOM",
  DEFAULT: "DEFAULT",
  TEMPLATE: "TEMPLATE",
} as const;

// Type definitions
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type SubscriptionTier = (typeof SubscriptionTier)[keyof typeof SubscriptionTier];
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle];
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export type ImageType = (typeof ImageType)[keyof typeof ImageType];

// Default pricing structure (MYR per center per month in cents)
export const DEFAULT_PRICING = {
  premium: {
    monthly: 9900,     // RM99/month per center
    quarterly: 26700,  // RM89/month per center (10% discount)
    biannual: 47500,   // RM79/month per center (20% discount)
    annual: 89100      // RM74/month per center (25% discount)
  }
} as const;

// Default bulk discount structure
export const DEFAULT_BULK_DISCOUNTS = [
  { minCenters: 1, maxCenters: 1, discount: 0 },      // No discount for single center
  { minCenters: 2, maxCenters: 4, discount: 10 },     // 10% discount for 2-4 centers
  { minCenters: 5, maxCenters: 9, discount: 15 },     // 15% discount for 5-9 centers
  { minCenters: 10, maxCenters: 19, discount: 20 },   // 20% discount for 10-19 centers
  { minCenters: 20, maxCenters: 49, discount: 25 },   // 25% discount for 20-49 centers
  { minCenters: 50, maxCenters: 999, discount: 30 }   // 30% discount for 50+ centers
] as const;