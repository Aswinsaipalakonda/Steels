# Steel Company Website & Enquiry Management Platform
## Master Engineering Prompts & Phased Implementation Guide

This document contains actionable, copy-pasteable, step-by-step engineering prompts to build the entire production-grade **Steel Company Website & Enquiry Management Platform** according to the PRD.

---

### Database & Environment Prerequisites (Local Setup)
- **Local Database:** MySQL running via XAMPP (`localhost:3306`, user: `root`, password: ``).
- **Database Name:** `steel_company_db`
- **Node Environment:** Node.js v18+ / v20+ with npm.
- **Image Storage:** Cloudinary account (Cloud Name, API Key, API Secret).

---

## Table of Phases

1. [Phase 1: Project Scaffolding, Monorepo Structure & Database Setup (Prisma + MySQL)](#phase-1-project-scaffolding-monorepo-structure--database-setup)
2. [Phase 2: Backend Core — Authentication, RBAC, Error Handling & Cloudinary Service](#phase-2-backend-core--authentication-rbac-error-handling--cloudinary-service)
3. [Phase 3: Backend APIs — Categories, Products, Variants, Images & Hero Slides](#phase-3-backend-apis--categories-products-variants-images--hero-slides)
4. [Phase 4: Backend APIs — Enquiry Management Engine, Status Tracking, Analytics & Settings](#phase-4-backend-apis--enquiry-management-engine-status-tracking-analytics--settings)
5. [Phase 5: Frontend Scaffolding, Design Tokens, Satoshi Typography & Global Layout](#phase-5-frontend-scaffolding-design-tokens-satoshi-typography--global-layout)
6. [Phase 6: Public Frontend — Homepage, Hero Slider, Category Explorer & Value Propositions](#phase-6-public-frontend--homepage-hero-slider-category-explorer--value-propositions)
7. [Phase 7: Public Frontend — Product Catalogue, Live Filter Search & Product Detail Experience](#phase-7-public-frontend--product-catalogue-live-filter-search--product-detail-experience)
8. [Phase 8: Public Frontend — Quotation Request, Contact, About, Industries & Trust Pages](#phase-8-public-frontend--quotation-request-contact-about-industries--trust-pages)
9. [Phase 9: Admin Portal — Authentication, Admin Layout & Executive Analytics Dashboard](#phase-9-admin-portal--authentication-admin-layout--executive-analytics-dashboard)
10. [Phase 10: Admin Portal — Product, Category & Media Asset Management](#phase-10-admin-portal--product-category--media-asset-management)
11. [Phase 11: Admin Portal — Hero Slide & Site Content Management](#phase-11-admin-portal--hero-slide--site-content-management)
12. [Phase 12: Admin Portal — Enquiry Workflow Pipeline, Status History & Customer Directory](#phase-12-admin-portal--enquiry-workflow-pipeline-status-history--customer-directory)
13. [Phase 13: End-to-End Integration, Validation, SEO, Security Hardening & Hostinger Deployment Preparation](#phase-13-end-to-end-integration-validation-seo-security-hardening--hostinger-deployment-preparation)

---

## Phase 1: Project Scaffolding, Monorepo Structure & Database Setup

### Prompt 1.1: Project Directory Structure & Package Initialization
```text
Act as a Principal Full-Stack Engineer. Initialize a clean, robust full-stack project structure for the Steel Company Website and Enquiry Platform in the current directory.

Directory Layout:
- root/
  - server/ (Node.js + Express + TypeScript + Prisma ORM)
  - client/ (React + Vite + TypeScript + Tailwind CSS)
  - package.json (Workspace root scripts to run concurrent dev, build, and test)

1. Create the root `package.json` with npm scripts for concurrently running `client` and `server`.
2. Initialize `server/` with:
   - `package.json` (Express, @types/express, cors, helmet, dotenv, cookie-parser, morgan, jsonwebtoken, bcryptjs, zod, multer, cloudinary, @prisma/client, prisma, typescript, ts-node-dev, rimraf)
   - `tsconfig.json` (Strict TypeScript configuration target ES2022)
   - `.env.example`
3. Initialize `client/` with Vite React TypeScript configuration:
   - `package.json` (React 18+, react-router-dom, @tanstack/react-query, axios, lucide-react, clsx, tailwind-merge, framer-motion, react-hook-form, @hookform/resolvers, zod)
   - `tsconfig.json` & `vite.config.ts` (with `@/` path alias pointing to `src/`)
   - `tailwind.config.js` & `postcss.config.js`
4. Provide a `.gitignore` configured for Node, Vite, logs, and environment files.
```

### Prompt 1.2: Prisma Schema for MySQL (XAMPP) & Database Migration
```text
Act as a Senior Database Architect. Create the complete, production-ready Prisma schema and initial migration for our MySQL database running on local XAMPP (`mysql://root:@localhost:3306/steel_company_db`).

The schema must follow all requirements in the PRD and include audit fields (createdAt, updatedAt):

1. `User` (id, email, passwordHash, name, role [SUPER_ADMIN, ADMIN, STAFF], isActive, createdAt, updatedAt)
2. `Category` (id, name, slug, description, imageUrl, imagePublicId, displayOrder, isActive, createdAt, updatedAt)
3. `Brand` (id, name, slug, logoUrl, logoPublicId, description, isActive, createdAt, updatedAt)
4. `Product` (id, name, slug, categoryId, brandId, shortDescription, fullDescription, primarySpecification, availableUnits, isFeatured, isActive, displayOrder, availabilityStatus [AVAILABLE, LIMITED, ON_REQUEST, UNAVAILABLE], createdAt, updatedAt)
5. `ProductImage` (id, productId, imageUrl, imagePublicId, altText, isPrimary, displayOrder, createdAt)
6. `ProductSpecification` (id, productId, specKey, specValue, displayOrder)
7. `ProductVariant` (id, productId, sku, name, diameter, grade, thickness, length, size, finish, isAvailable, additionalSpecs [JSON], createdAt, updatedAt)
8. `Customer` (id, name, email, phone, company, location, notes, createdAt, updatedAt)
9. `Enquiry` (id, enquiryNumber [unique format e.g. ENQ-YYYYMMDD-XXXX], customerId, productId, variantId, quantity, unit, location, message, sourcePage, status [NEW, CONTACTED, QUOTATION_SENT, NEGOTIATION, CONFIRMED, COMPLETED, CANCELLED], assignedUserId, internalNotes, createdAt, updatedAt)
10. `EnquiryStatusHistory` (id, enquiryId, previousStatus, newStatus, changedById, note, createdAt)
11. `HeroSlide` (id, title, subtitle, bgImageUrl, bgImagePublicId, fgImageUrl, fgImagePublicId, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink, displayOrder, isActive, createdAt, updatedAt)
12. `WebsiteSetting` (id, key [unique], value, group [CONTACT, GENERAL, STATS, SOCIAL], createdAt, updatedAt)
13. `ContactSubmission` (id, name, email, phone, subject, message, isRead, createdAt)

Create the `server/prisma/schema.prisma` file and create a seed script `server/prisma/seed.ts` with initial Super Admin user, steel categories (TMT Bars, Structural Steel, Steel Plates, Pipes & Tubes), initial products with variants, and default hero slides.
```

---

## Phase 2: Backend Core — Authentication, RBAC, Error Handling & Cloudinary Service

### Prompt 2.1: Server Setup, Global Error Handling & Middleware Pipeline
```text
Act as a Senior Backend Architect. Implement the core Express server pipeline in `server/src/`:

1. `server/src/server.ts` & `server/src/app.ts`:
   - Helmet security headers
   - CORS setup (allowing frontend localhost & configurable production domain)
   - Cookie parser & JSON body parser with size limits
   - Morgan logger
   - Rate limiter for public APIs (especially `/api/enquiries` and `/api/contact`)
   - API prefix `/api/v1`
   - Health check endpoint `/health`
2. `server/src/utils/apiResponse.ts`: Standardized response format `{ success: boolean, data?: any, message?: string, errors?: any, meta?: any }`.
3. `server/src/utils/apiError.ts`: Custom `ApiError` class with HTTP status codes and operational error flags.
4. `server/src/middleware/errorHandler.ts`: Central error handling middleware that captures Prisma errors, Zod validation errors, JWT errors, and returns human-readable responses without leaking internal stack traces in production.
5. `server/src/middleware/validate.ts`: Request validation middleware using Zod schemas for `body`, `query`, and `params`.
6. `server/src/config/db.ts`: Prisma Client singleton instance with connection health logging.
```

### Prompt 2.2: Authentication, JWT, RBAC Middleware & Admin User Management
```text
Act as a Security Specialist & Backend Engineer. Implement secure JWT authentication and Role-Based Access Control (RBAC) in `server/src/modules/auth/`:

1. `auth.schema.ts`: Zod schemas for login, password change, user creation/update.
2. `auth.service.ts`:
   - `login`: Validate credentials against `User`, verify bcrypt hash, generate Access Token (short-lived) & Refresh Token (or HTTP-only secure cookie).
   - `getCurrentUser`: Retrieve profile without password hash.
   - `changePassword`: Verify old password, hash new password.
   - `createUser`, `updateUser`, `listUsers`, `deleteUser` (Super Admin only).
3. `auth.controller.ts`: Controller handlers returning standardized API responses.
4. `auth.routes.ts`: Routes for `/api/v1/auth/login`, `/api/v1/auth/logout`, `/api/v1/auth/me`, `/api/v1/auth/change-password`, `/api/v1/auth/users`.
5. `server/src/middleware/auth.middleware.ts`:
   - `authenticate`: Verify JWT from Authorization Bearer header or HTTP-only cookie, attach user object to `req.user`.
   - `authorize(...roles)`: RBAC middleware ensuring the authenticated user has one of the allowed roles (`SUPER_ADMIN`, `ADMIN`, `STAFF`).
```

### Prompt 2.3: Cloudinary Media Upload Service
```text
Act as a Cloud Architect & Backend Engineer. Implement the Cloudinary file upload and management integration in `server/src/services/cloudinary.service.ts`:

1. `server/src/config/cloudinary.ts`: Configure Cloudinary SDK using server environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
2. `server/src/middleware/upload.middleware.ts`: Multer memory storage configuration with image file type filtering (JPEG, PNG, WEBP) and size limits (max 5MB).
3. `cloudinary.service.ts`:
   - `uploadImage(buffer, folder, options)`: Upload to specified Cloudinary folder (e.g., `steel_platform/products`, `steel_platform/categories`, `steel_platform/hero`) with automatic webp conversion and optimization.
   - `deleteImage(publicId)`: Remove image asset from Cloudinary.
   - Helper to generate responsive Cloudinary URLs (thumbnails, hero banner crops).
4. `server/src/modules/media/`: Standalone upload route `/api/v1/media/upload` (protected by admin auth) for on-the-fly image management.
```

---

## Phase 3: Backend APIs — Categories, Products, Variants, Images & Hero Slides

### Prompt 3.1: Category & Brand Management APIs
```text
Act as a Backend Engineer. Build the RESTful API modules for Categories and Brands in `server/src/modules/categories/` and `server/src/modules/brands/`:

1. `category.schema.ts`: Zod schemas for create/update category (name, slug, description, image, displayOrder, isActive).
2. `category.service.ts`:
   - `getAllCategories(includeInactive)`: Public gets active categories with product counts; Admin gets all with pagination.
   - `getCategoryBySlug(slug)`: Fetch single category with active products.
   - `createCategory`: Handle image upload to Cloudinary and insert DB record.
   - `updateCategory`: Support updating metadata and optional image replacement (deleting old Cloudinary asset if replaced).
   - `deleteCategory`: Check if linked products exist; allow archive/deactivate or hard delete.
   - `reorderCategories`: Update `displayOrder` in a single transaction.
3. Controller & routes (`/api/v1/categories` public GET, admin POST/PUT/DELETE).
4. Implement corresponding Brand endpoints in `server/src/modules/brands/` with logo upload and product count.
```

### Prompt 3.2: Product & Variant Catalog Management APIs
```text
Act as a Backend Engineer. Build the comprehensive Product Catalog and Variant REST APIs in `server/src/modules/products/`:

1. `product.schema.ts`:
   - Zod schemas for creating and updating products with nested specifications, variants, and primary image.
   - Query filters schema (search query, categorySlug, brandSlug, grade, availabilityStatus, isFeatured, sort, page, limit).
2. `product.service.ts`:
   - `getPublicProducts`: Search across title, specs, description, category; filter by multiple dimensions; paginate; return optimized card payloads.
   - `getPublicProductBySlug(slug)`: Return full product detail including category, brand, gallery images, variants, specifications, and related products (same category).
   - `createProduct`: Transactional creation of Product + Specifications + Initial Variants + Images.
   - `updateProduct`: Full update with partial diffing for variants and specs.
   - `deleteProduct`: Soft delete (`isActive = false`) or hard delete with Cloudinary asset cleanup.
   - `toggleFeatured(id)` & `updateAvailabilityStatus(id, status)`.
3. `variant.service.ts`: Dedicated CRUD for product variants (Diameter, Grade, Thickness, Length, Size, Finish, Sku).
4. `productImage.service.ts`: Add gallery images, set primary image, delete gallery image, reorder images.
5. Setup routes in `/api/v1/products`.
```

### Prompt 3.3: Hero Slides & Homepage Content APIs
```text
Act as a Backend Engineer. Build the Hero Slide and Website Content Settings APIs in `server/src/modules/hero-slides/` and `server/src/modules/settings/`:

1. `heroSlide.schema.ts` & `service.ts`:
   - `getPublicSlides`: Fetch active slides ordered by `displayOrder`.
   - `getAllAdminSlides`: Fetch all slides.
   - `createSlide`: Upload background image / foreground image to Cloudinary, save slide data.
   - `updateSlide`: Update text, links, active state, replace images.
   - `reorderSlides`: Bulk update slide order.
   - `deleteSlide`: Remove DB record and delete Cloudinary assets.
2. `settings.service.ts`:
   - Key-value store for site stats (e.g., years in business, projects supplied, metric tons delivered), contact info (phones, emails, address, working hours), and company story.
   - Public GET `/api/v1/settings/public`
   - Admin PUT `/api/v1/settings/bulk`
3. Setup routes in `/api/v1/hero-slides` and `/api/v1/settings`.
```

---

## Phase 4: Backend APIs — Enquiry Management Engine, Status Tracking, Analytics & Settings

### Prompt 4.1: Enquiry Submission & Customer Management Engine
```text
Act as a Backend Engineer. Implement the core Enquiry & Quotation processing engine in `server/src/modules/enquiries/` and `server/src/modules/customers/`:

1. `enquiry.schema.ts`:
   - Public enquiry submission schema (customerName, phone, email, company, productId, variantId, quantity, unit, location, message, sourcePage).
   - Admin enquiry update schema (status, assignedUserId, internalNotes, noteForTimeline).
   - Admin query filters (search, status, dateFrom, dateTo, productId, assignedUserId, page, limit).
2. `enquiry.service.ts`:
   - `createPublicEnquiry`:
     - Generate unique Enquiry Number formatted as `ENQ-YYYYMMDD-XXXX` (atomic sequence).
     - Find or create `Customer` record based on email and phone.
     - Create `Enquiry` record in transaction.
     - Automatically record first entry in `EnquiryStatusHistory` (status: `NEW`, note: "Enquiry submitted by customer").
   - `getAdminEnquiries`: Paginated search with customer and product relations.
   - `getEnquiryById`: Full detail with customer profile, product/variant data, assigned staff, and chronological status history.
   - `updateEnquiryStatus`: Validate status transition (`NEW` -> `CONTACTED` -> `QUOTATION_SENT` -> `NEGOTIATION` -> `CONFIRMED` -> `COMPLETED` / `CANCELLED`), record `EnquiryStatusHistory` with the authenticated admin's ID and note.
   - `assignStaff(enquiryId, userId)`: Update assigned staff member.
3. `customer.service.ts`: Customer directory listing, customer enquiry history aggregation, update customer details.
4. Contact submissions module in `server/src/modules/contact/` (public POST `/api/v1/contact`, admin GET with mark-as-read).
```

### Prompt 4.2: Admin Analytics & Business Metrics API
```text
Act as a Backend Data Engineer. Implement the executive dashboard metrics in `server/src/modules/analytics/`:

1. `analytics.service.ts`:
   - `getDashboardOverview`:
     - Total enquiries count (all-time & current month)
     - Enquiries by status breakdown (New, Contacted, Quotation Sent, Confirmed, Completed, Cancelled)
     - Total active products & categories count
     - Conversion rate (Confirmed+Completed / Total Enquiries)
   - `getEnquiryTrends(days = 30)`: Grouped daily/weekly enquiry volume for charting.
   - `getTopEnquiredProducts(limit = 5)`: Most requested steel products with percentage share.
   - `getRecentEnquiries(limit = 8)`: Latest enquiry feed with customer name, product, quantity, status badge, and time elapsed.
2. Secure endpoint `/api/v1/analytics/dashboard` restricted to Admin/Super Admin.
```

---

## Phase 5: Frontend Scaffolding, Design Tokens, Satoshi Typography & Global Layout

### Prompt 5.1: Tailwind CSS Design Tokens, Brand Palette & Typography Setup
```text
Act as a Principal Frontend Engineer & UI Designer. Configure the design system, typography, and color tokens in `client/`:

1. Download and configure the **Satoshi** font family (weights 400, 500, 600, 700, 800) in `client/src/index.css` and fallback to `ui-sans-serif, system-ui, sans-serif`.
2. Configure `client/tailwind.config.js` with the strict PRD color tokens:
   - `brand-black`: `#020403` (Deep Black Green)
   - `brand-forest-dark`: `#02150C` (Deep Forest)
   - `brand-forest`: `#03281A` (Primary Forest Green)
   - `brand-green-rich`: `#063A20` (Rich Green)
   - `brand-green-accent`: `#07552B` (Accent Green)
   - `brand-olive`: `#697057` (Muted Olive)
   - `brand-offwhite`: `#F4F6F3` (Light Surface)
   - `brand-white`: `#FFFFFF`
   - Ensure ZERO purple or violet gradients exist.
3. Create atomic UI primitives in `client/src/components/ui/`:
   - `Button.tsx` (variants: primary forest, outline, dark-accent, ghost; sizes: sm, md, lg; loading spinner state; accessible focus rings)
   - `Input.tsx` & `Textarea.tsx` (industrial clean border, rounded-lg, focus:ring-brand-green-accent, error message display)
   - `Select.tsx` (accessible dropdown with clear labels)
   - `Badge.tsx` (status pills: New, Contacted, Quotation Sent, Confirmed, Completed, Cancelled, Available, On Request)
   - `Modal.tsx` & `Drawer.tsx` (accessible dialog with Framer Motion backdrop and escape key support)
   - `Card.tsx` (subtle border, rounded-xl, soft shadow)
   - `Toast.tsx` notification provider using React Context.
```

### Prompt 5.2: Public Navigation Header, Footer & Global App Shell
```text
Act as a Senior React Engineer. Implement the responsive Public Website Navigation, Mobile Drawer, and Industrial Footer in `client/src/components/layout/`:

1. `Header.tsx`:
   - Sticky navbar with scroll-detection (transparent over dark hero, transition to solid `#02150C` with backdrop blur on scroll).
   - High-contrast brand logo with industrial steel typography.
   - Desktop navigation links (Products, Categories, About Us, Industries, Quality & Specs, Contact).
   - Prominent "Request a Quote" CTA button.
   - Mobile hamburger menu button opening an accessible sliding navigation drawer with Framer Motion.
2. `Footer.tsx`:
   - Dark green background (`#020403` / `#02150C`).
   - Company identity, brief industrial positioning statement.
   - Quick links (Product Categories, Corporate, Compliance & Quality, Support).
   - Contact details (Direct phone, email, registered office address, working hours).
   - Legal links (Privacy Policy, Terms of Supply) and copyright notice.
3. `PublicLayout.tsx`: Shell wrapping Header, dynamic `<Outlet />`, Footer, and floating "Quick Enquiry" or "Call Sales" badge.
4. `SEOHead.tsx`: Reusable SEO meta tags component managing `<title>`, `<meta name="description">`, canonical URLs, and Open Graph tags.
```

---

## Phase 6: Public Frontend — Homepage, Hero Slider, Category Explorer & Value Propositions

### Prompt 6.1: Hero Section & Dynamic Hero Slider with Motion Reveal
```text
Act as a Creative Frontend Engineer. Build the high-impact Homepage Hero Section and Slider in `client/src/components/home/HeroSection.tsx`:

1. Integrate with `useQuery` to fetch active hero slides from `/api/v1/hero-slides`.
2. Implement dynamic hero presentation:
   - Full-viewport dark industrial atmosphere (`#020403` to `#02150C`).
   - High-resolution background imagery with subtle zoom effect and darkened gradient overlay for high text contrast.
   - Large, confident display typography in Satoshi font ("BUILT FOR STRENGTH. ENGINEERED FOR SCALE.").
   - Supporting value proposition subtitle.
   - Dual CTAs: Primary "Explore Products" (links to catalogue) & Secondary "Request a Quote" (opens quote modal/page).
   - Slide indicators (progress bars or minimal dots) and smooth 3–4 second auto-advance with pause-on-hover.
   - Initial entrance animation using Framer Motion (subtle vertical displacement and opacity reveal, respecting `prefers-reduced-motion`).
```

### Prompt 6.2: Homepage Content Sections (Categories, Featured Products, Trust, Applications & CTA)
```text
Act as a Frontend Engineer. Build all marketing sections on the Homepage in `client/src/pages/HomePage.tsx`:

1. `CategoryGridSection.tsx`:
   - Visual grid of steel categories (TMT Rebars, Structural Beams, Steel Plates & Coils, Hollow Sections & Pipes, Wire Rods).
   - Image cards with dark overlay, category title, short description, product count badge, and hover scale transition.
2. `FeaturedProductsSection.tsx`:
   - Carousel/Grid of featured products with specifications (Grade, Diameter, Standards), "View Details" and "Quick Quote" buttons.
3. `WhyChooseUsSection.tsx`:
   - 4-column feature highlights: BIS Certified Quality, Direct Mill Pricing, Reliable Logistics & Timely Dispatch, Technical Consultation.
4. `IndustriesSection.tsx`:
   - Sectors served: Infrastructure & Highways, High-Rise Commercial Construction, Industrial Fabrication, Energy & Transmission.
5. `StatsCounterSection.tsx`:
   - Animated count-up metrics: Metric Tons Supplied, Active Contractor Clients, Delivery Reach, Years of Trust.
6. `FinalCTASection.tsx`:
   - High-impact closing banner ("Need Steel for Your Next Project? Get a Rapid Quote from Our Technical Sales Team") with immediate action buttons.
```

---

## Phase 7: Public Frontend — Product Catalogue, Live Filter Search & Product Detail Experience

### Prompt 7.1: Product Catalogue Page with Filtering, Search & Sorting
```text
Act as a Senior Frontend Engineer. Build the Product Catalogue and Search experience in `client/src/pages/ProductsPage.tsx`:

1. `ProductFilters.tsx`:
   - Category selector (sidebar on desktop, collapsible bottom-sheet on mobile).
   - Grade/Standard filter chips (e.g., Fe 500D, Fe 550D, IS 2062, ASTM A36).
   - Availability status filter.
   - Clear all filters button.
2. `ProductSearchInput.tsx`:
   - Debounced search bar with instant query suggestions and clear button.
3. `ProductGrid.tsx`:
   - Responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop).
   - `ProductCard.tsx`: Optimized Cloudinary image, category badge, product title, grade/dimension tag, brief summary, "Request Quote" button and "View Specifications" link.
4. Loading skeleton cards and Empty Search State with suggested categories and clear filter action.
5. URL synchronization: Sync category, search, and page query params to URL via React Router `useSearchParams`.
```

### Prompt 7.2: Product Detail Page with Multi-Dimensional Variant Selector & Gallery
```text
Act as a Senior Frontend Engineer. Build the comprehensive Product Detail Page in `client/src/pages/ProductDetailPage.tsx`:

1. `ProductGallery.tsx`:
   - Main high-resolution image preview with Cloudinary zoom optimization.
   - Horizontal thumbnail strip for multiple product views.
2. Product Information Hierarchy:
   - Breadcrumb navigation (Home > Products > Category Name > Product Name).
   - Product title, category tag, brand, and availability status badge.
   - Concise product description and manufacturing standards.
3. `VariantSelector.tsx`:
   - Interactive variant pills for Diameter (8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm), Length (12m, Custom), Grade (Fe 500D, Fe 550D), Finish.
   - Dynamic specification table updates as the user selects different variants.
4. `SpecificationsTable.tsx`: Clean industrial table displaying Yield Strength, Tensile Strength, Chemical Composition, Standard Length, Weight per Meter.
5. `RelatedProducts.tsx`: Grid of complementary products from the same category.
```

### Prompt 7.3: Product Detail Inline & Modal Quotation Request Component
```text
Act as a Senior Frontend Engineer. Build the structured Quotation Enquiry form on the Product Detail page (`client/src/components/enquiry/ProductEnquiryForm.tsx`):

1. Auto-populated fields from the selected product and variant (Product Name, Selected Diameter/Grade).
2. Quantity and Unit Selection:
   - Numeric quantity input with plus/minus step controls.
   - Unit dropdown (Metric Tons [MT], Bundles, Pieces [PCS], Kilograms [KG], Meters).
3. Customer Details Form (using React Hook Form + Zod):
   - Full Name
   - Phone Number (with format validation)
   - Email Address
   - Company / Contractor Name (optional)
   - Delivery Location / Project Site (City, Pincode/State)
   - Message / Specific Custom Cut Requirements
4. Submission handling:
   - Submit to `POST /api/v1/enquiries`.
   - Show inline loading spinner on button.
   - On success: Render high-trust Confirmation Card with generated Enquiry Reference Number (`ENQ-YYYYMMDD-XXXX`), expected callback window (e.g., "Within 2 business hours"), and direct WhatsApp/Phone contact link.
```

---

## Phase 8: Public Frontend — Quotation Request, Contact, About, Industries & Trust Pages

### Prompt 8.1: Dedicated "Request a Quote" General Page
```text
Act as a Frontend Engineer. Build the dedicated Request a Quote page in `client/src/pages/RequestQuotePage.tsx`:

1. Multi-item or general project steel quotation form.
2. Allow selecting one or multiple product categories or custom steel requirements.
3. Project Details section: Project Type (Residential, Commercial, Infrastructure, Industrial), Estimated Quantity, Target Delivery Date, Site Delivery Address.
4. Client Information: Contact Person, Designation, Company Name, GST Number (optional), Phone, Email.
5. Clear trust badges beside the form: "Direct Mill Pricing", "Transparent Weighment", "Test Certificates Provided", "Dedicated Account Manager".
6. Form submission with instant confirmation modal and reference ID.
```

### Prompt 8.2: About Us, Industries, Quality/Certifications & Contact Us Pages
```text
Act as a Frontend Engineer. Build the corporate and informational pages in `client/src/pages/`:

1. `AboutPage.tsx`:
   - Company heritage, vision, infrastructure, warehouse capacity, and steel distribution network.
   - Executive leadership & core values (Integrity, Precision, Reliability).
2. `IndustriesPage.tsx`:
   - Detailed breakdown of industries served with case studies/application guides (Heavy Construction, Pre-Engineered Buildings, Bridges & Highways).
3. `QualityCertificationsPage.tsx`:
   - Quality control processes (Spectro Analysis, Universal Testing Machine, Bend & Re-bend tests).
   - Downloadable/viewable Mill Test Certificate (MTC) sample, ISO certifications, and BIS compliance details.
4. `ContactPage.tsx`:
   - Interactive Contact Form submitting to `POST /api/v1/contact`.
   - Office & Yard location cards with interactive Google Maps embed, direct click-to-call phone numbers, sales department emails, and operating hours.
5. `LegalPage.tsx`: Generic layout for Privacy Policy and Terms of Supply.
```

---

## Phase 9: Admin Portal — Authentication, Admin Layout & Executive Analytics Dashboard

### Prompt 9.1: Admin Authentication, Protected Route Guard & State Management
```text
Act as a Full-Stack Engineer. Implement the Admin Authentication UI and protected route architecture in `client/src/admin/`:

1. `AdminAuthContext.tsx`: React context for managing admin auth token, user profile, login, logout, and session check on reload.
2. `AdminLoginPage.tsx`:
   - Clean, secure industrial admin login screen with dark forest aesthetic (`#02150C`).
   - Email and password input with show/hide password toggle.
   - Error alert for invalid credentials.
   - Loading state on login button.
3. `AdminProtectedRoute.tsx`:
   - Route wrapper checking authentication status; redirects unauthenticated visitors to `/admin/login`.
   - Role verification (e.g. restricts user management to `SUPER_ADMIN`).
4. `adminApi.ts`: Axios instance configured with base URL, automatic Bearer token injection, and 401 response interceptor that triggers automatic logout and redirect.
```

### Prompt 9.2: Admin Layout (Sidebar, Topbar & Notification System)
```text
Act as a UI Engineer. Build the Admin Portal layout shell in `client/src/admin/layout/AdminLayout.tsx`:

1. `AdminSidebar.tsx`:
   - Collapsible desktop sidebar and mobile overlay drawer.
   - Navigation items with Lucide icons:
     - Dashboard (`/admin/dashboard`)
     - Enquiries & Leads (`/admin/enquiries`)
     - Products (`/admin/products`)
     - Categories (`/admin/categories`)
     - Hero Slides (`/admin/hero-slides`)
     - Customers (`/admin/customers`)
     - Site Settings (`/admin/settings`)
     - User Management (`/admin/users` - Super Admin only)
   - Active route styling with forest green accent (`#07552B`).
2. `AdminTopbar.tsx`:
   - Page title and breadcrumbs.
   - New Enquiries quick counter badge.
   - Current logged-in user profile avatar, name, role badge, and Logout dropdown.
3. Content area wrapper with standard padding and responsive overflow management.
```

### Prompt 9.3: Executive Dashboard & Analytics View
```text
Act as a Frontend Engineer. Build the Admin Analytics Dashboard in `client/src/admin/pages/DashboardPage.tsx`:

1. Fetch summary metrics from `/api/v1/analytics/dashboard` using TanStack Query.
2. Metric KPI Cards:
   - Total Enquiries (with month-over-month indicator)
   - New / Unaddressed Enquiries (highlighted with urgent badge)
   - Quotations Sent
   - Confirmed Orders / Leads
   - Total Active Products & Categories
3. Visual Charts (using a lightweight charting library like Recharts or Chart.js):
   - Enquiry Trend Line Chart (past 30 days)
   - Enquiry Breakdown by Status (Donut / Bar chart)
   - Top 5 Enquired Steel Products
4. Recent Enquiries Quick Table:
   - Showing Enquiry Number, Customer Name, Product, Quantity, Status Badge, Date, and "View Details" action.
```

---

## Phase 10: Admin Portal — Product, Category & Media Asset Management

### Prompt 10.1: Category & Brand CRUD with Cloudinary Image Upload
```text
Act as a Full-Stack Engineer. Build the Category and Brand management interface in `client/src/admin/pages/CategoriesPage.tsx`:

1. Category Data Table:
   - Image thumbnail, Category Name, Slug, Product Count, Display Order, Active Status toggle, and Actions (Edit, Delete, Reorder).
2. Category Form Modal (Add / Edit):
   - Name input (auto-generates slug).
   - Description textarea.
   - Display order number input.
   - Cloudinary image dropzone with real-time preview, upload progress, and image replacement support.
   - Active/Inactive switch.
3. Drag-and-drop or up/down display ordering.
4. Delete confirmation modal with validation preventing deletion if active products belong to the category.
```

### Prompt 10.2: Product Catalog List, Search, Filter & Bulk Actions
```text
Act as a Frontend Engineer. Build the Product Management table view in `client/src/admin/pages/ProductsPage.tsx`:

1. Data Table with pagination, search, and category filter:
   - Primary Image thumbnail.
   - Product Name and Category.
   - Key Grade / Primary Specification.
   - Availability Status badge (Available, Limited, On Request, Unavailable).
   - Featured toggle switch (instantly updates `isFeatured` via API).
   - Active status toggle.
   - Actions: Edit, Manage Gallery, Delete.
2. Empty state and batch actions (bulk activate/deactivate).
```

### Prompt 10.3: Add & Edit Product Form with Dynamic Variants & Specifications
```text
Act as a Senior Full-Stack Engineer. Build the comprehensive Product Form in `client/src/admin/pages/ProductFormPage.tsx`:

1. Basic Information Tab:
   - Product Name, Slug, Category dropdown, Brand dropdown, Short Summary, Detailed Description.
   - Availability Status selector & Display Order.
2. Specifications Tab:
   - Dynamic Key-Value repeater (e.g. Yield Strength: 500 N/mm², Standard Length: 12m, Carbon Equivalent: 0.42% max) with Add/Remove row buttons.
3. Variants Tab:
   - Interactive variant matrix builder allowing entry for Diameter, Grade, Thickness, Length, Size, SKU, Availability.
4. Gallery Images Tab:
   - Multi-image Cloudinary uploader.
   - Drag to reorder gallery images.
   - "Set as Primary Image" button on individual thumbnails.
   - Delete image confirmation.
5. Form validation using React Hook Form + Zod, handling create and update operations seamlessly with success toast notification.
```

---

## Phase 11: Admin Portal — Hero Slide & Site Content Management

### Prompt 11.1: Hero Slide Manager with Visual Preview
```text
Act as a Full-Stack Engineer. Build the Hero Slide Manager in `client/src/admin/pages/HeroSlidesPage.tsx`:

1. Slide List View:
   - Background image thumbnail, Headline Title, Subtitle, CTA buttons list, Display Order, Active toggle, Edit and Delete actions.
2. Slide Editor Modal:
   - Headline Title input.
   - Subtitle textarea.
   - Primary CTA Text & URL link.
   - Secondary CTA Text & URL link.
   - Cloudinary Image Uploader for Background Banner (with recommended aspect ratio 16:9 guidelines).
   - Foreground/Accent visual upload (optional).
   - Live Slide Preview component rendering exactly how the slide appears on the public homepage.
3. Reordering controls to set primary slide sequence.
```

### Prompt 11.2: Website Content & Company Settings Manager
```text
Act as a Frontend Engineer. Build the Site Settings & Content Manager in `client/src/admin/pages/SettingsPage.tsx`:

1. Company & Contact Details Tab:
   - Company Legal Name, Display Name.
   - Sales Phone Numbers, WhatsApp enquiry number.
   - Sales & Support Email Addresses.
   - Registered Office and Yard / Warehouse physical addresses.
   - Operating / Dispatch Hours.
2. Statistics & Trust Metrics Tab:
   - Metric Tons Supplied (e.g., "500,000+ MT").
   - Completed Projects (e.g., "1,200+ Projects").
   - Years in Steel Industry (e.g., "25+ Years").
   - Network / Cities Covered (e.g., "150+ Locations").
3. Social Media & Legal Tab:
   - LinkedIn, WhatsApp, Facebook, Instagram URLs.
   - GST Number, ISO Certification Numbers.
4. Form submit with batch update to `/api/v1/settings/bulk`.
```

---

## Phase 12: Admin Portal — Enquiry Workflow Pipeline, Status History & Customer Directory

### Prompt 12.1: Enquiry Management Table & Kanban Pipeline View
```text
Act as a Senior Frontend Engineer. Build the Enquiry Pipeline and Management interface in `client/src/admin/pages/EnquiriesPage.tsx`:

1. View Toggle: Data Table View vs. Kanban Pipeline Board (columns: New, Contacted, Quotation Sent, Negotiation, Confirmed, Completed, Cancelled).
2. Advanced Filters:
   - Search by Enquiry Number, Customer Name, Phone, Email.
   - Filter by Status, Date Range, Product, and Assigned Staff Member.
3. Quick Table Columns:
   - Enquiry # (`ENQ-YYYYMMDD-XXXX`)
   - Received Date & Time (with relative time, e.g., "20 mins ago")
   - Customer (Name, Phone, Company)
   - Requested Product & Variant
   - Quantity & Unit
   - Current Status Badge
   - Assigned Staff
   - Action: "Open Details"
4. Quick status update dropdown directly from table row.
```

### Prompt 12.2: Enquiry Detail Drawer / Page with Status Timeline & Internal Notes
```text
Act as a Senior Full-Stack Engineer. Build the Enquiry Detail view in `client/src/admin/pages/EnquiryDetailPage.tsx`:

1. Header:
   - Enquiry Number, Current Status Badge, Received Timestamp, Source Page URL.
   - Action buttons: "Direct Call", "Send WhatsApp", "Send Email", "Change Status".
2. Customer Profile Card:
   - Full Name, Phone, Email, Company, Delivery Location.
   - Link to view all previous enquiries from this customer.
3. Product & Quantity Requirement Card:
   - Product Name, Category, Selected Variant specifications.
   - Quantity and Unit requested.
   - Customer's requirement message/notes.
4. Status Transition & Staff Assignment Modal:
   - Select New Status.
   - Assign to Staff Member.
   - Add status change note (e.g., "Quotation of ₹54,000/MT sent via email").
5. Chronological Activity & Status Timeline:
   - Complete history showing timestamp, previous status, new status, changed by user name, and notes.
6. Internal Team Notes section for collaborative sales follow-ups.
```

### Prompt 12.3: Customer Directory & Contact Submissions View
```text
Act as a Frontend Engineer. Build the Customer Directory and Contact Messages in `client/src/admin/pages/CustomersPage.tsx` and `ContactSubmissionsPage.tsx`:

1. Customer Directory:
   - Aggregated list of leads from enquiries (Name, Phone, Email, Company, Total Enquiries Submitted, Last Enquiry Date).
   - Search and export to CSV functionality.
2. Contact Submissions Page:
   - Listing of general contact form submissions from `/contact`.
   - Message preview, sender details, date, Mark as Read / Replied toggle.
```

---

## Phase 13: End-to-End Integration, Validation, SEO, Security Hardening & Hostinger Deployment Preparation

### Prompt 13.1: Form Validation, Accessibility (WCAG 2.1 AA) & Performance Audit
```text
Act as a Quality Assurance & Web Performance Specialist. Review and polish the entire application:

1. Accessibility (WCAG 2.1 AA):
   - Verify keyboard navigation for all interactive modals, drawers, dropdowns, and form elements.
   - Ensure color contrast ratios meet AA standards across all dark forest green (`#03281A`, `#02150C`) and off-white backgrounds.
   - Ensure all image tags have descriptive alt attributes and icon buttons have `aria-label` tags.
   - Verify that all CSS transitions and animations respect `prefers-reduced-motion`.
2. Responsive QA:
   - Verify zero horizontal scrolling across Mobile (320px+), Tablet (768px+), and Desktop (1024px, 1440px+).
   - Test data tables on mobile (convert to card view or responsive horizontal scroll containers).
3. Performance Optimization:
   - Implement route-based lazy loading with `React.lazy` and `Suspense`.
   - Optimize Cloudinary image transformations (auto format `f_auto`, auto quality `q_auto`, responsive widths).
   - Verify bundle size and remove unused packages.
```

### Prompt 13.2: Production Build & Hostinger Business Web Hosting Deployment Guide
```text
Act as a DevOps & Cloud Infrastructure Engineer. Prepare the project for production deployment on Hostinger Business Web Hosting with Node.js and MySQL:

1. Create production build scripts:
   - `client/`: `npm run build` producing optimized static files in `client/dist/`.
   - `server/`: `npm run build` compiling TypeScript to `server/dist/`.
2. Configure production environment templates (`server/.env.production` and `client/.env.production`).
3. Setup `server/src/server.ts` production serving:
   - Ability to serve compiled React client as static assets or run as dedicated API on a subdomain (`api.yourdomain.com`).
   - Setup CORS for the production domain.
4. Prepare Hostinger step-by-step deployment documentation (`DEPLOYMENT.md`):
   - MySQL database creation on Hostinger hPanel & running Prisma migrations (`npx prisma migrate deploy` or applying SQL schema).
   - Setting up Node.js application in Hostinger hPanel (Node version, entry point `dist/server.js`, environment variables).
   - Uploading frontend build assets.
   - Cloudinary environment setup.
   - SSL / HTTPS verification.
```

---

## Summary of Completed Implementation Workflow

Follow the phases sequentially from **Phase 1 to Phase 13**. Execute each prompt, verify the changes, run automated tests and database validations, and then proceed to the next phase to build a robust, production-grade Steel Company Platform.
