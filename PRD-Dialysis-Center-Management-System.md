# Product Requirements Document (PRD)
## Dialysis Center Management System with Authentication & Subscription

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [Subscription Tier Features](#3-subscription-tier-features)
4. [Pricing & Bulk Discount System](#4-pricing--bulk-discount-system)
5. [Database Schema Updates](#5-database-schema-updates)
6. [Authentication System Architecture](#6-authentication-system-architecture)
7. [API Design](#7-api-design)
8. [Image Management & S3 Integration](#8-image-management--s3-integration)
9. [User Interface Requirements](#9-user-interface-requirements)
10. [Payment Integration](#10-payment-integration)
11. [Analytics & Reporting](#11-analytics--reporting)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Technical Specifications](#13-technical-specifications)
14. [Security Considerations](#14-security-considerations)
15. [Success Metrics](#15-success-metrics)

---

## 1. Executive Summary

### 1.1 Project Overview
Transform the existing public dialysis center directory into a comprehensive SaaS platform with role-based authentication, subscription tiers, and premium features for dialysis center owners and administrators.

### 1.2 Key Objectives
- Implement secure authentication using BetterAuth
- Create two-tier subscription system (Free and Premium)
- Enable business owners to manage their centers independently
- Provide analytics and reporting capabilities
- Integrate CHIP payment system for subscription management
- Maintain existing public directory functionality
- Implement proper S3 image management system

### 1.3 Current System Analysis
**Existing Features:**
- Public directory with center listings and search functionality
- Basic premium features (featured flag, enhanced display)
- S3 infrastructure for image storage (already configured)
- Prisma database with SQLite/Turso
- Next.js 14 App Router with TypeScript

**Gaps to Address:**
- No authentication or user management system
- Manual subscription management via scripts
- Hardcoded fallback images instead of dynamic S3 integration
- No role-based access control
- No business owner dashboard

---

## 2. User Roles & Permissions

### 2.1 Super Admin
**Capabilities:**
- Full CRUD operations on all dialysis centers
- User management (create, edit, delete business owner accounts)
- Subscription management and pricing overrides
- System analytics and reporting dashboard
- Content moderation and approval
- Manual center-to-owner assignment
- Default image management
- Bulk discount configuration

### 2.2 Business Owner
**Capabilities:**
- CRUD operations on owned dialysis centers only
- Subscription management (view, upgrade/downgrade)
- Analytics dashboard for owned centers
- Image gallery management (subscription tier-based limits)
- Profile and account management
- Multi-center management (if owns multiple centers)

### 2.3 Public Users (Unchanged)
**Capabilities:**
- Browse and search dialysis centers
- View center details and contact information
- Use maps and filtering features
- Access enhanced features for premium centers

---

## 3. Subscription Tier Features

### 3.1 Free Tier
- Basic center listing
- Standard center detail page
- Basic contact information display
- Up to 3 custom images per center
- Standard search visibility

### 3.2 Premium Tier
- **Premium looks** (Enhanced center detail page - existing `EnhancedDialysisCenterDetails`)
- **Featured badge** with priority placement in search results (existing)
- **Unlimited image gallery** with carousel and lightbox (existing)
- **Monthly analytics report** (PDF generation with center performance metrics)
- **Advanced contact options** (WhatsApp integration, enhanced CTA buttons - existing)
- **Custom benefits section** with icons and descriptions (existing)

---

## 4. Pricing & Bulk Discount System

### 4.1 Default Pricing Structure
```typescript
// Suggested default pricing (MYR per center per month)
const DEFAULT_PRICING = {
  premium: {
    monthly: 99,     // RM99/month per center
    quarterly: 267,  // RM89/month per center (10% discount)
    biannual: 475,   // RM79/month per center (20% discount)
    annual: 891      // RM74/month per center (25% discount)
  }
}
```

### 4.2 Bulk Discount Structure (Suggested Defaults)
```typescript
const DEFAULT_BULK_DISCOUNTS = [
  { minCenters: 1, maxCenters: 1, discount: 0 },      // No discount for single center
  { minCenters: 2, maxCenters: 4, discount: 10 },     // 10% discount for 2-4 centers
  { minCenters: 5, maxCenters: 9, discount: 15 },     // 15% discount for 5-9 centers
  { minCenters: 10, maxCenters: 19, discount: 20 },   // 20% discount for 10-19 centers
  { minCenters: 20, maxCenters: 49, discount: 25 },   // 25% discount for 20-49 centers
  { minCenters: 50, maxCenters: 999, discount: 30 }   // 30% discount for 50+ centers
]
```

### 4.3 Custom Pricing
- Super admin can set custom pricing for specific business owners
- Override bulk discounts for special cases
- Granular control over individual user pricing

---

## 5. Database Schema Updates

### 5.1 New Models

#### User Model
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  emailVerified Boolean  @default(false)
  name          String
  image         String?
  role          UserRole @default(BUSINESS_OWNER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // BetterAuth fields
  sessions      Session[]
  accounts      Account[]
  
  // Business relationships
  ownedCenters  CenterOwnership[]
  subscriptions UserSubscription[]
  
  @@index([email])
  @@index([role])
}
```

#### Center Ownership Model
```prisma
model CenterOwnership {
  id               String         @id @default(cuid())
  userId           String
  dialysisCenterId String
  isActive         Boolean        @default(true)
  assignedAt       DateTime       @default(now())
  assignedBy       String         // Admin user ID
  
  user             User           @relation(fields: [userId], references: [id])
  dialysisCenter   DialysisCenter @relation(fields: [dialysisCenterId], references: [id])
  
  @@unique([userId, dialysisCenterId])
  @@index([userId])
  @@index([dialysisCenterId])
}
```

#### Subscription Model
```prisma
model UserSubscription {
  id                String            @id @default(cuid())
  userId            String
  tier              SubscriptionTier
  status            SubscriptionStatus @default(ACTIVE)
  billingCycle      BillingCycle      @default(MONTHLY)
  centerCount       Int               @default(0)
  basePrice         Int               // Price per center in cents
  bulkDiscount      Int               @default(0) // Percentage discount applied
  finalPrice        Int               // Final price after discount in cents
  customPricing     Boolean           @default(false) // If admin set custom pricing
  
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd Boolean           @default(false)
  chipSubscriptionId String?
  
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  user              User              @relation(fields: [userId], references: [id])
  payments          Payment[]
  
  @@index([userId])
  @@index([status])
  @@index([tier])
  @@index([currentPeriodEnd])
}
```

#### Payment Model
```prisma
model Payment {
  id               String        @id @default(cuid())
  subscriptionId   String
  chipPaymentId    String        @unique
  amount           Int           // Amount in cents
  currency         String        @default("MYR")
  status           PaymentStatus @default(PENDING)
  paymentMethod    String        // "duitnow_qr", "card", etc.
  billingCycle     BillingCycle
  
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  subscription     UserSubscription @relation(fields: [subscriptionId], references: [id])
  
  @@index([subscriptionId])
  @@index([status])
  @@index([chipPaymentId])
}
```

#### Analytics Model
```prisma
model CenterAnalytics {
  id               String         @id @default(cuid())
  dialysisCenterId String
  date             DateTime       @db.Date
  views            Int            @default(0)
  phoneClicks      Int            @default(0)
  whatsappClicks   Int            @default(0)
  emailClicks      Int            @default(0)
  websiteClicks    Int            @default(0)
  mapClicks        Int            @default(0)
  
  dialysisCenter   DialysisCenter @relation(fields: [dialysisCenterId], references: [id])
  
  @@unique([dialysisCenterId, date])
  @@index([dialysisCenterId])
  @@index([date])
}
```

#### Pricing Models
```prisma
model PricingTier {
  id           String       @id @default(cuid())
  tier         SubscriptionTier
  billingCycle BillingCycle
  basePrice    Int          // Price in cents per center
  isActive     Boolean      @default(true)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  @@unique([tier, billingCycle])
  @@index([tier])
  @@index([isActive])
}

model BulkDiscount {
  id          String   @id @default(cuid())
  minCenters  Int
  maxCenters  Int
  discount    Int      // Percentage discount (0-100)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([minCenters, maxCenters])
  @@index([isActive])
}
```

#### Enhanced Image Models
```prisma
model CenterImage {
  id               String         @id @default(cuid())
  url              String         // S3 public URL
  s3Key            String         // S3 object key for deletion
  altText          String         @default("")
  description      String?
  displayOrder     Int            @default(0)
  isActive         Boolean        @default(true)
  imageType        ImageType      @default(CUSTOM)
  fileSize         Int?           // File size in bytes
  dimensions       String?        // "1200x800" format
  uploadedBy       String?        // User ID who uploaded
  
  dialysisCenter   DialysisCenter @relation(fields: [dialysisCenterId], references: [id], onDelete: Cascade)
  dialysisCenterId String
  
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@index([dialysisCenterId])
  @@index([displayOrder])
  @@index([isActive])
  @@index([imageType])
}

model DefaultImage {
  id          String    @id @default(cuid())
  s3Key       String    @unique
  url         String    // S3 public URL
  altText     String
  category    String    // "general", "hemodialysis", "peritoneal", "pediatric"
  isActive    Boolean   @default(true)
  displayOrder Int      @default(0)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([category])
  @@index([isActive])
  @@index([displayOrder])
}
```

### 5.2 Enums
```prisma
enum UserRole {
  SUPER_ADMIN
  BUSINESS_OWNER
}

enum SubscriptionTier {
  FREE
  PREMIUM
}

enum SubscriptionStatus {
  ACTIVE
  INACTIVE
  PAST_DUE
  CANCELED
  TRIALING
}

enum BillingCycle {
  MONTHLY
  QUARTERLY
  BIANNUAL
  ANNUAL
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELED
  REFUNDED
}

enum ImageType {
  CUSTOM      // User uploaded
  DEFAULT     // System default
  TEMPLATE    // Admin provided template
}
```

### 5.3 Updated DialysisCenter Model
```prisma
model DialysisCenter {
  // ... existing fields ...
  
  // New relationships
  ownership     CenterOwnership[]
  analytics     CenterAnalytics[]
  
  // Computed field based on owner's subscription
  isPremium Boolean @default(false)
  
  // ... existing indexes ...
  @@index([isPremium])
}
```

---

## 6. Authentication System Architecture

### 6.1 BetterAuth Configuration
- **Provider**: Email/Password authentication
- **Session Management**: JWT with refresh tokens
- **Rate Limiting**: Built-in rate limiter for login attempts
- **Security**: Password hashing with bcrypt, CSRF protection
- **Database Integration**: Automatic user table management

### 6.2 Authorization Middleware
- Route-based protection for admin and owner dashboards
- API endpoint protection with role-based access control
- Center ownership validation for business owner operations
- Subscription tier validation for feature access

### 6.3 Registration Flow
1. Super admin creates business owner account via admin dashboard
2. System generates secure registration token and sends email
3. Business owner clicks link and sets password
4. Admin assigns centers to business owner
5. Business owner gains access to dashboard

---

## 7. API Design

### 7.1 Authentication Endpoints
```typescript
POST /api/auth/signin                   // Email/password login
POST /api/auth/signup                   // Token-based registration
POST /api/auth/signout                  // Logout
GET  /api/auth/session                  // Get current session
POST /api/auth/forgot-password          // Request password reset
POST /api/auth/reset-password           // Reset password with token
```

### 7.2 User Management (Admin Only)
```typescript
GET    /api/admin/users                 // List all business owners
POST   /api/admin/users                 // Create new business owner
PUT    /api/admin/users/[id]            // Update business owner
DELETE /api/admin/users/[id]            // Delete business owner
POST   /api/admin/users/[id]/assign-centers  // Assign centers to owner
POST   /api/admin/users/[id]/send-registration  // Send registration link
```

### 7.3 Center Management
```typescript
GET    /api/dashboard/centers           // Get owned centers (business owner)
GET    /api/dashboard/centers/[id]      // Get specific center details
PUT    /api/dashboard/centers/[id]      // Update owned center
POST   /api/dashboard/centers/[id]/images  // Upload images (tier-limited)
DELETE /api/dashboard/centers/[id]/images/[imageId]  // Delete image
PUT    /api/dashboard/centers/[id]/images/reorder    // Reorder images
```

### 7.4 Subscription Management
```typescript
GET    /api/subscriptions/current       // Get current subscription
POST   /api/subscriptions/create        // Create new subscription
PUT    /api/subscriptions/[id]/upgrade  // Upgrade subscription
PUT    /api/subscriptions/[id]/cancel   // Cancel subscription
GET    /api/subscriptions/calculate-price  // Calculate pricing
POST   /api/subscriptions/webhooks/chip    // CHIP webhook handler
```

### 7.5 Pricing Management (Admin Only)
```typescript
GET    /api/admin/pricing               // Get current pricing structure
PUT    /api/admin/pricing               // Update base pricing
GET    /api/admin/bulk-discounts        // Get bulk discount structure
PUT    /api/admin/bulk-discounts        // Update bulk discounts
POST   /api/admin/users/[id]/custom-pricing  // Set custom pricing
```

### 7.6 Analytics
```typescript
GET /api/analytics/centers/[id]         // Center-specific analytics
GET /api/analytics/overview             // Business owner overview
GET /api/admin/analytics/system         // System-wide analytics (admin)
GET /api/analytics/reports/monthly      // Generate monthly report
```

### 7.7 Image Management
```typescript
GET    /api/admin/default-images        // Manage default images (admin)
POST   /api/admin/default-images        // Upload new default images
PUT    /api/admin/default-images/[id]   // Update default image
DELETE /api/admin/default-images/[id]   // Remove default image
GET    /api/images/[centerId]           // Get center images with fallbacks
```

---

## 8. Image Management & S3 Integration

### 8.1 Current State Analysis
The system currently has:
- **S3 Infrastructure**: Fully configured AWS S3 setup with upload/delete functionality
- **Hardcoded Fallbacks**: Static images in `/public/contoh/` directory and Unsplash URLs
- **Database Integration**: `CenterImage` model with S3 key storage
- **API Endpoints**: Working image upload/delete endpoints

### 8.2 Image Management Strategy

#### 8.2.1 Premium Centers (Subscription-based)
- **Custom Image Gallery**: Business owners can upload unlimited images via dashboard
- **S3 Storage**: All uploaded images stored in AWS S3 with proper organization
- **Image Optimization**: Automatic resizing and compression via Sharp
- **Gallery Management**: Drag-and-drop reordering, alt text editing, deletion

#### 8.2.2 Free Tier Centers
- **Limited Uploads**: Maximum 3 images per center
- **Default Gallery**: System-provided professional medical facility images
- **S3 Storage**: Same infrastructure, just limited quantity

#### 8.2.3 Fallback System
- **Default Images**: High-quality medical facility stock images stored in S3
- **Graceful Degradation**: If no custom images, show relevant default images
- **Location-based**: Different default sets based on center location/type

### 8.3 S3 Storage Organization

#### 8.3.1 Folder Structure
```
dialysis-centers/
├── [centerId]/
│   ├── original/           # Original uploaded images
│   ├── optimized/         # Compressed versions
│   └── thumbnails/        # Small preview images
├── defaults/
│   ├── general/           # General medical facility images
│   ├── hemodialysis/      # HD-specific images
│   ├── peritoneal/        # PD-specific images
│   └── pediatric/         # Pediatric facility images
└── temp/                  # Temporary uploads (auto-cleanup)
```

#### 8.3.2 Image Processing Pipeline
```typescript
interface ImageProcessingOptions {
  original: { maxWidth: 1920, maxHeight: 1080, quality: 95 },
  optimized: { maxWidth: 1200, maxHeight: 800, quality: 85 },
  thumbnail: { maxWidth: 400, maxHeight: 300, quality: 80 }
}

// Automatic processing on upload
async function processAndUploadImage(file: File, centerId: string) {
  const processed = await Promise.all([
    sharp(file.buffer).resize(1920, 1080, { fit: 'inside' }).jpeg({ quality: 95 }),
    sharp(file.buffer).resize(1200, 800, { fit: 'inside' }).jpeg({ quality: 85 }),
    sharp(file.buffer).resize(400, 300, { fit: 'inside' }).jpeg({ quality: 80 })
  ]);
  
  // Upload all versions to S3
  // Return URLs for database storage
}
```

### 8.4 Migration Strategy for Existing Images

#### 8.4.1 Hardcoded Image Migration
```typescript
// Migration script to move static images to S3
async function migrateStaticImagesToS3() {
  const staticImages = [
    { path: '/public/contoh/satu.webp', category: 'general' },
    { path: '/public/contoh/dua.webp', category: 'general' },
    { path: '/public/contoh/tiga.webp', category: 'general' },
    { path: '/public/contoh/empat.webp', category: 'general' },
    // ... more images
  ];
  
  for (const image of staticImages) {
    // Upload to S3 defaults folder
    // Create DefaultImage database entries
    // Update references in code
  }
}
```

#### 8.4.2 Unsplash URL Replacement
- **Phase 1**: Replace Unsplash URLs with curated medical facility images
- **Phase 2**: Upload high-quality default images to S3
- **Phase 3**: Remove external dependencies

---

## 9. User Interface Requirements

### 9.1 Authentication Pages
- **Login Page**: Email/password form with "Forgot Password" link
- **Registration Page**: Secure token-based registration completion
- **Password Reset**: Email-based password reset flow
- **Session Management**: Automatic logout on token expiry

### 9.2 Super Admin Dashboard
- **User Management**: CRUD operations for business owners
- **Center Assignment**: Interface to assign centers to owners
- **Subscription Overview**: View and manage all subscriptions
- **System Analytics**: Comprehensive analytics dashboard
- **Pricing Management**: Configure base pricing and bulk discounts
- **Default Image Management**: Upload and manage default images
- **Content Moderation**: Review and approve center content

### 9.3 Business Owner Dashboard
- **Center Management**: List and edit owned centers
- **Image Gallery Manager**: Upload, organize, and edit center images
- **Analytics Dashboard**: View center performance metrics
- **Subscription Management**: Current plan, usage, billing history
- **Profile Settings**: Account information and preferences
- **Multi-center Overview**: Aggregate view for multiple centers

### 9.4 Enhanced Public Features
- **Subscription-based Center Display**: Different layouts based on subscription tier
- **Analytics Tracking**: Track user interactions for reporting
- **Improved Image Loading**: Optimized S3 image delivery
- **SEO Enhancements**: Better structured data and meta tags

### 9.5 Image Management Interface
- **Gallery Manager**: Visual interface for uploading, organizing, and editing images
- **Drag & Drop Upload**: Modern file upload with progress indicators
- **Image Editor**: Basic editing tools (crop, rotate, brightness)
- **Alt Text Management**: SEO-friendly alt text editing
- **Usage Analytics**: Track which images get the most engagement

---

## 10. Payment Integration

### 10.1 CHIP Integration
- **Initial Payment**: DuitNowQR for subscription setup and one-time payments
- **Recurring Payments**: Card-based payments for automatic renewal
- **Webhook Handling**: Process payment status updates securely
- **Subscription Management**: Handle upgrades, downgrades, cancellations

### 10.2 Payment Flow
1. **Subscription Creation**: User selects plan and billing cycle
2. **Price Calculation**: System calculates final price with bulk discounts
3. **Payment Processing**: CHIP handles payment via DuitNowQR or card
4. **Webhook Confirmation**: System receives payment confirmation
5. **Subscription Activation**: Features unlocked immediately upon payment

### 10.3 Billing Features
- **Prorated Billing**: Calculate prorated amounts for plan changes
- **Grace Period**: 1-week grace period for expired subscriptions
- **Payment History**: Track all payments and invoices
- **Automatic Renewal**: Card-based recurring payments
- **Billing Notifications**: Email notifications for upcoming renewals

### 10.4 CHIP API Integration
```typescript
// Create subscription payment
async function createSubscriptionPayment(userId: string, planDetails: any) {
  const chipPayment = await chip.purchases.create({
    amount: planDetails.finalPrice,
    currency: 'MYR',
    payment_method_types: ['duitnow_qr', 'card'],
    metadata: {
      userId,
      subscriptionTier: planDetails.tier,
      billingCycle: planDetails.cycle
    }
  });
  
  return chipPayment;
}
```

---

## 11. Analytics & Reporting

### 11.1 Center Analytics Tracking
- **View Tracking**: Page views, unique visitors, session duration
- **Interaction Tracking**: Phone clicks, WhatsApp clicks, email clicks
- **Geographic Data**: Visitor location analytics
- **Referral Tracking**: Traffic sources and referrals
- **Device Analytics**: Mobile vs desktop usage
- **Time-based Analysis**: Peak viewing hours and days

### 11.2 Monthly Reports (Premium Feature)
- **Automated Generation**: Monthly PDF reports for Premium subscribers
- **Key Metrics**: Views, interactions, conversion rates
- **Comparison Data**: Month-over-month performance
- **Visual Charts**: Graphs and charts for easy understanding
- **Email Delivery**: Automatic email delivery of reports

### 11.3 Dashboard Analytics
- **Real-time Metrics**: Live view counts and interactions
- **Historical Data**: Trend analysis over time
- **Comparative Analysis**: Performance vs other centers (anonymized)
- **Goal Tracking**: Set and track performance goals

### 11.4 Admin Analytics
- **System-wide Metrics**: Total users, subscriptions, revenue
- **User Behavior**: Platform usage patterns
- **Revenue Analytics**: Subscription trends and forecasting
- **Performance Monitoring**: System health and performance metrics

---

## 12. Implementation Roadmap

### Phase 1: Authentication & Core System (4-6 weeks)

#### Week 1-2: Foundation Setup
- **BetterAuth Integration**: Configure authentication system
- **Database Schema**: Implement new models and relationships
- **Basic UI Components**: Login, registration, and basic dashboard layouts
- **Middleware Setup**: Authentication and authorization middleware

#### Week 3-4: User Management
- **Admin Dashboard**: User CRUD operations
- **Registration Flow**: Token-based business owner registration
- **Role-based Access**: Implement permission system
- **Session Management**: Secure session handling

#### Week 5-6: Center Ownership
- **Ownership Assignment**: Admin interface for assigning centers
- **Business Owner Dashboard**: Basic center management interface
- **Center CRUD**: Business owner center editing capabilities
- **Testing**: Comprehensive testing of authentication flow

### Phase 2: Subscription & Payment System (3-4 weeks)

#### Week 1-2: Subscription Core
- **Subscription Models**: Implement subscription database schema
- **Pricing Engine**: Build flexible pricing calculation system
- **Bulk Discount Logic**: Implement multi-center discount system
- **Admin Pricing Tools**: Interface for managing pricing and discounts

#### Week 3-4: Payment Integration
- **CHIP Integration**: Implement CHIP API for payments
- **Payment Flow**: Complete payment processing workflow
- **Webhook Handling**: Secure webhook processing for payment confirmations
- **Billing Management**: Subscription lifecycle management

### Phase 3: Image Management & S3 Integration (3-4 weeks)

#### Week 1-2: S3 Enhancement
- **Image Processing Pipeline**: Multi-resolution image processing
- **S3 Organization**: Implement proper folder structure
- **Default Image System**: Create default image management
- **Migration Scripts**: Move hardcoded images to S3

#### Week 3-4: Image Management UI
- **Upload Interface**: Drag-and-drop image upload
- **Gallery Management**: Image organization and editing tools
- **Subscription Limits**: Tier-based upload restrictions
- **Image Optimization**: Automatic compression and formatting

### Phase 4: Analytics & Enhanced Features (3-4 weeks)

#### Week 1-2: Analytics System
- **Tracking Implementation**: User interaction tracking
- **Analytics Database**: Store and process analytics data
- **Dashboard Development**: Analytics visualization
- **Real-time Updates**: Live analytics updates

#### Week 3-4: Reporting & Polish
- **Monthly Reports**: PDF report generation
- **Email Automation**: Automated report delivery
- **UI Polish**: Final UI/UX improvements
- **Performance Optimization**: System optimization

### Phase 5: Testing & Deployment (2-3 weeks)

#### Week 1-2: Comprehensive Testing
- **Unit Testing**: Test all core functions
- **Integration Testing**: Test complete workflows
- **User Acceptance Testing**: Test with real users
- **Performance Testing**: Load and stress testing

#### Week 3: Production Deployment
- **Production Setup**: Configure production environment
- **Data Migration**: Migrate existing data
- **Monitoring Setup**: Implement logging and monitoring
- **Launch**: Go-live with monitoring

---

## 13. Technical Specifications

### 13.1 Technology Stack
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Shadcn UI
- **Authentication**: BetterAuth
- **Database**: Prisma with SQLite/Turso
- **Payment**: CHIP API integration
- **File Storage**: AWS S3 (existing setup)
- **Image Processing**: Sharp for optimization
- **Analytics**: Custom implementation with database storage

### 13.2 Performance Requirements
- **Page Load Time**: < 3 seconds for all pages
- **API Response Time**: < 500ms for most API calls
- **Image Loading**: < 2 seconds for optimized images
- **Database Optimization**: Proper indexing for all query patterns
- **Caching Strategy**: Implement caching for frequently accessed data

### 13.3 Scalability Considerations
- **Database**: Prepared for migration to PostgreSQL if needed
- **CDN**: CloudFront distribution for S3 bucket (recommended)
- **Load Balancing**: Ready for horizontal scaling
- **Caching**: Redis implementation for session and data caching

### 13.4 Image Optimization Requirements
- **Format**: JPEG for photos, WebP where supported
- **Compression**: Multi-tier compression (original, optimized, thumbnail)
- **Lazy Loading**: Implement lazy loading for better performance
- **CDN Delivery**: Optimized delivery through CloudFront

---

## 14. Security Considerations

### 14.1 Authentication Security
- **Password Security**: bcrypt hashing with appropriate salt rounds
- **Session Management**: Secure JWT tokens with refresh mechanism
- **Rate Limiting**: Prevent brute force attacks on login
- **CSRF Protection**: Cross-site request forgery protection
- **Email Verification**: Verify email addresses for account security

### 14.2 Data Security
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based access control with proper authorization checks
- **Audit Logging**: Track all administrative actions and data changes
- **Data Backup**: Regular automated backups with encryption

### 14.3 File Upload Security
- **File Validation**: Strict file type, size, and content validation
- **Malware Scanning**: Scan uploaded files for malicious content
- **S3 Security**: Proper bucket policies and access controls
- **Image Processing**: Sanitize and re-process all uploaded images

### 14.4 Payment Security
- **PCI Compliance**: Follow PCI DSS guidelines for payment processing
- **Webhook Security**: Secure webhook verification
- **Data Minimization**: Store minimal payment-related data
- **Audit Trail**: Complete audit trail for all payment transactions

---

## 15. Success Metrics

### 15.1 Business Metrics
- **User Adoption**: Number of registered business owners
- **Subscription Conversion**: Free to paid subscription conversion rate (target: 25%)
- **Revenue Growth**: Monthly recurring revenue from subscriptions
- **User Engagement**: Dashboard usage and feature adoption rates
- **Customer Retention**: Monthly churn rate (target: < 5%)

### 15.2 Technical Metrics
- **System Uptime**: 99.9% availability target
- **Performance**: Page load times < 3s, API response times < 500ms
- **Security**: Zero security incidents
- **Data Integrity**: No data loss incidents
- **Image Delivery**: Average image load time < 2s

### 15.3 User Experience Metrics
- **Dashboard Usage**: Time spent in dashboard, feature usage rates
- **Support Requests**: Reduction in support tickets through better UX
- **User Satisfaction**: User feedback scores and NPS
- **Feature Adoption**: Adoption rate of new features

### 15.4 Operational Metrics
- **Processing Time**: Payment processing success rate > 99%
- **Report Generation**: Monthly report delivery success rate > 99%
- **Image Processing**: Upload success rate > 99%
- **System Resources**: CPU, memory, and storage utilization

---

## Conclusion

This comprehensive PRD provides the blueprint for transforming the existing dialysis center directory into a full-featured SaaS platform. The implementation will be done in phases to ensure stability and allow for iterative improvements based on user feedback.

**Key Benefits of This Approach:**
1. **Scalable Architecture**: Built to handle growth in users and data
2. **Revenue Generation**: Clear subscription model with bulk discounts
3. **User-Centric Design**: Intuitive interfaces for all user types
4. **Security-First**: Comprehensive security measures throughout
5. **Performance Optimized**: Fast, responsive user experience
6. **Analytics-Driven**: Data-driven insights for business decisions

**Next Steps:**
1. Review and approve this PRD
2. Set up development environment and project structure
3. Begin Phase 1 implementation
4. Regular progress reviews and stakeholder updates
5. Iterative improvements based on user feedback

The system will maintain backward compatibility with the existing public directory while adding powerful new capabilities for business owners and administrators.
