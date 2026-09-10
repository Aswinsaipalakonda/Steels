# Steel Company Website & Enquiry Management Platform
## Product Requirements Document (PRD)

**Document Status:** Product Definition  
**Version:** 1.0  
**Primary Experience:** Premium B2B steel product catalogue and enquiry platform  
**Frontend:** React + Vite + TypeScript  
**Backend:** Node.js + Express + TypeScript  
**Database:** MySQL  
**ORM:** Prisma  
**Image Management:** Cloudinary  
**Hosting:** Hostinger Business Web Hosting  
**Primary UI Font:** Satoshi, ui-sans-serif, system-ui, sans-serif

---

# 1. Product Overview

The product is a premium, modern website for a steel products company. The website must present the company's steel products and categories in a highly visual, trustworthy, industrial, and minimalist manner.

The website is **not intended to behave like a conventional consumer e-commerce store**. The primary commercial action is to allow customers to select a product, specify the required quantity and relevant requirements, and submit an enquiry or quotation request.

A dedicated admin dashboard will allow authorized company staff to manage products, categories, website content, enquiries, customers, and enquiry statuses.

The design direction is inspired by the supplied Pioneer reference image and the referenced steel websites, while remaining an original design rather than a direct copy.

---

# 2. Product Goals

## 2.1 Primary Goals

1. Create a premium and credible online presence for the steel company.
2. Make steel products easy to discover and understand.
3. Allow customers to request quotations without requiring a traditional shopping cart or online checkout.
4. Capture structured customer enquiries.
5. Give administrators a centralized enquiry management workflow.
6. Allow administrators to manage products and website content without developer intervention.
7. Create a fast, responsive, mobile-first experience.
8. Establish a distinctive visual identity based on deep green, black, off-white, olive, and subtle warm metallic tones.
9. Use restrained motion and reveal animations to create a premium experience without sacrificing usability or performance.
10. Build the system so it can be extended later with additional products, branches, sales workflows, notifications, and other business functionality.

## 2.2 Secondary Goals

- Improve organic discoverability of product and category pages.
- Build trust through company information, quality indicators, certifications, brands, and service information.
- Encourage direct quotation requests and contact.
- Provide useful enquiry data to the company's sales team.
- Make future content changes possible through the admin dashboard.

---

# 3. Product Positioning

The visual and product positioning should communicate:

- Strength
- Reliability
- Precision
- Industrial quality
- Professionalism
- Modern engineering
- Trust
- Scale
- Long-term business relationships

The website should feel like a **premium industrial brand**, not a generic template, commodity marketplace, or flashy technology startup.

Avoid excessive visual effects, excessive glassmorphism, noisy patterns, unnecessary gradients, and trendy effects that weaken the industrial identity.

---

# 4. Target Users

## 4.1 Primary Customer Segments

- Construction companies
- Builders
- Contractors
- Civil engineering firms
- Fabricators
- Infrastructure companies
- Industrial buyers
- Procurement teams
- Dealers and distributors
- Architects and project managers
- Individual customers with significant steel requirements

## 4.2 Admin Users

### Super Admin

Can manage all website and business data.

Capabilities:

- Manage administrators
- Manage products
- Manage categories
- Manage product images
- Manage enquiries
- Change enquiry statuses
- View customer information
- Manage homepage content
- Manage hero slides
- Manage website settings
- View dashboard analytics

### Staff/Admin

Capabilities can be restricted according to role.

Typical permissions:

- View enquiries
- Update enquiry status
- View customers
- Create/edit products
- Manage product images
- View dashboard metrics

The permission model should be designed so additional roles can be introduced later.

---

# 5. Core Business Model

The system follows a **catalogue + enquiry / quotation** model.

The customer should not be forced through:

- Add to cart
- Checkout
- Payment
- Shipping selection
- Order confirmation

unless those capabilities are explicitly introduced in a future version.

The primary conversion flow is:

**Discover Product → View Product → Select Requirements → Request Quote → Sales Follow-up**

---

# 6. Customer Journey

## 6.1 Primary Journey

1. Customer lands on homepage.
2. Customer sees hero section and primary call-to-action.
3. Customer explores product categories.
4. Customer opens a category.
5. Customer views available products.
6. Customer opens a specific product.
7. Customer reviews specifications and product information.
8. Customer selects available product options/variants.
9. Customer enters quantity and unit.
10. Customer optionally provides location and additional requirements.
11. Customer submits enquiry.
12. System validates the information.
13. System creates the enquiry.
14. Customer receives a clear confirmation.
15. Enquiry becomes visible in the admin dashboard.
16. Sales staff contacts the customer.
17. Admin updates enquiry status throughout the sales process.

---

# 7. Website Information Architecture

## Public Website

### Primary Routes

- Home
- Products
- Product Categories
- Product Details
- About Us
- Industries / Applications
- Brands
- Quality / Certifications
- Contact
- Request a Quote
- Privacy Policy
- Terms and Conditions

### Administrative Routes

- Admin Login
- Admin Dashboard
- Products
- Add Product
- Edit Product
- Categories
- Enquiries
- Enquiry Details
- Customers
- Hero Slides
- Website Content
- Users / Administrators
- Settings

---

# 8. Homepage Requirements

The homepage should be visually strong but restrained.

## 8.1 Header

Desktop header:

- Company logo
- Product navigation
- About
- Industries / Applications
- Contact
- Request Quote CTA

Mobile header:

- Logo
- Menu trigger
- Request Quote CTA where space permits

Header behavior:

- Transparent or visually integrated over the hero when appropriate.
- Transition to a solid/light or dark surface when scrolling.
- Maintain excellent contrast.
- Sticky navigation may be used.
- Avoid excessive shadows.

## 8.2 Hero Section

The hero is the primary visual statement of the website.

Requirements:

- Full-width or near full-viewport presentation.
- Strong steel-related imagery or high-quality industrial visual.
- Dark green / black visual foundation.
- Large, confident headline.
- Supporting statement.
- Primary CTA: Explore Products.
- Secondary CTA: Request a Quote.
- Dynamic slide capability.

Example content direction:

**BUILT FOR STRENGTH.  
ENGINEERED FOR SCALE.**

Supporting text should communicate the company's product range, quality, availability, or service proposition.

### Hero Slider

The admin must be able to manage hero slides.

Each slide can contain:

- Title
- Subtitle
- Background image
- Optional foreground image
- Primary CTA
- Secondary CTA
- CTA destinations
- Display order
- Active/inactive status

Automatic slide transitions should be subtle.

The homepage should include a short visual animation sequence of approximately 3–4 seconds where appropriate.

The animation must not delay meaningful content unnecessarily.

## 8.3 Hero Animation

Animation principles:

- Smooth entrance
- Subtle scale
- Opacity transitions
- Text reveal
- Image movement
- Small staggered elements
- No excessive bouncing
- No distracting perpetual motion

Animation should support the brand rather than become the product.

## 8.4 Product Categories

Display the company's major steel categories.

Each category card should include:

- Category image
- Category name
- Short description
- Product count where useful
- Discover/View Products action

Cards should use rounded corners and subtle hover behavior.

## 8.5 Featured Products

Display selected products managed from the admin dashboard.

Each card may contain:

- Product image
- Product name
- Category
- Key specification
- Short description
- Request Quote action
- View Details action

Do not display fake prices if the business model is quotation-based.

## 8.6 Why Choose Us

Possible content:

- Quality assured
- Reliable supply
- Wide product range
- Competitive quotation
- Experienced team
- Timely delivery
- Trusted brands
- Technical support

Use simple visual indicators rather than oversized decorative icons.

## 8.7 Industries / Applications

Show how the products are used.

Potential segments:

- Residential construction
- Commercial construction
- Infrastructure
- Industrial projects
- Fabrication
- Manufacturing
- Engineering

## 8.8 Trust / Quality Section

Possible content:

- Certifications
- Quality standards
- Authorized brands
- Testing procedures
- Years of experience
- Customer/project count
- Supply capability

Only show verified claims provided by the customer.

## 8.9 Statistics

Optional metrics such as:

- Years of experience
- Products
- Projects served
- Customers
- Cities served

Statistics must be factual and configurable through admin.

## 8.10 Final CTA

A strong but minimalist enquiry section.

Example direction:

**Need steel for your next project?**

Supporting message followed by:

**Request a Quote**

The section should visually transition into the footer.

## 8.11 Footer

Include:

- Logo
- Company description
- Product links
- Company links
- Contact information
- Phone
- Email
- Address
- Social links where applicable
- Privacy Policy
- Terms
- Copyright

---

# 9. Product Catalogue

## 9.1 Product Listing

Product listing pages should support:

- Category filtering
- Search
- Sorting
- Pagination or progressive loading
- Product cards
- Responsive layouts

Avoid unnecessary filters unless they represent real business attributes.

## 9.2 Product Card

Each product card should have:

- High-quality product image
- Product name
- Category
- Primary specification
- Short description
- View Product
- Request Quote

Hover effects should be subtle.

## 9.3 Product Details

Product detail pages are critical conversion pages.

Required sections:

1. Product image gallery
2. Product name
3. Category
4. Product description
5. Specifications
6. Available variants
7. Quantity selection
8. Unit selection
9. Customer requirement form
10. Request Quote CTA
11. Related products

### Product Information

Possible attributes:

- Grade
- Size
- Diameter
- Length
- Thickness
- Width
- Weight
- Material
- Brand
- Finish
- Application
- Availability

Only display attributes applicable to the specific product.

---

# 10. Product Variants

Products may have variants.

Examples:

- Diameter
- Size
- Grade
- Thickness
- Length
- Brand
- Finish

Variant selection should update relevant information without making the interface complicated.

The system must support products with:

- No variants
- One variant dimension
- Multiple variant dimensions

---

# 11. Quantity and Enquiry Interface

The quantity section should be prominent.

Fields may include:

- Quantity
- Unit
- Required delivery/location
- Customer name
- Phone
- Email
- Company
- Message / requirements

Supported units may include:

- KG
- TON
- PCS
- METER
- LENGTH
- Other units configured by admin

Do not hard-code business-specific units if the customer expects them to change.

---

# 12. Enquiry System

## 12.1 Enquiry Creation

An enquiry must capture:

- Unique enquiry number
- Customer name
- Phone
- Email
- Company
- Product
- Variant
- Quantity
- Unit
- Location
- Message
- Source page
- Submission timestamp
- Current status
- Assigned staff member
- Notes

## 12.2 Enquiry Statuses

Initial status flow:

- New
- Contacted
- Quotation Sent
- Negotiation
- Confirmed
- Completed
- Cancelled

The system should support future configurable statuses.

## 12.3 Enquiry Status History

Every meaningful status change should be recorded.

History should show:

- Previous status
- New status
- Changed by
- Date/time
- Optional note

## 12.4 Enquiry Detail Page

Admin should see:

- Customer information
- Product information
- Quantity
- Requirements
- Status
- Assigned staff
- Timeline
- Internal notes
- Status history

Admin actions:

- Change status
- Assign staff
- Add internal note
- Update customer details
- Contact customer using available contact information

---

# 13. Admin Dashboard

The dashboard should prioritize business information rather than visual decoration.

## 13.1 Dashboard Overview

Display:

- Total products
- Active products
- Categories
- New enquiries
- Pending enquiries
- Quotation sent
- Confirmed enquiries
- Completed enquiries

## 13.2 Recent Enquiries

Show:

- Enquiry number
- Customer
- Product
- Quantity
- Status
- Date
- Assigned staff

## 13.3 Enquiry Analytics

Useful optional metrics:

- Enquiries by status
- Enquiries by product
- Enquiries by category
- Enquiries over time
- Conversion count
- Average response time

Charts should remain minimal and readable.

## 13.4 Product Management

Admin capabilities:

- Create product
- Edit product
- Delete/archive product
- Activate/deactivate product
- Feature/unfeature product
- Manage images
- Manage specifications
- Manage variants
- Assign categories
- Assign brands
- Manage ordering

## 13.5 Category Management

Admin capabilities:

- Create category
- Edit category
- Archive category
- Upload category image
- Add description
- Configure display order
- Activate/deactivate category

## 13.6 Hero Slide Management

Admin capabilities:

- Create slide
- Upload image
- Edit title
- Edit subtitle
- Configure CTAs
- Reorder slides
- Activate/deactivate slide
- Preview slide

## 13.7 Website Content

Where appropriate, admin should manage:

- Homepage text
- CTA content
- Company information
- Contact information
- Statistics
- Footer information

Content management should not make the dashboard unnecessarily complex.

---

# 14. Image Management

Cloudinary will be used for product and website imagery.

Images should not be stored as binary data inside MySQL.

The database should store the relevant image references and metadata.

Admin image features:

- Upload
- Preview
- Replace
- Delete
- Reorder
- Set primary image

Recommended image categories:

- Product images
- Category images
- Hero images
- Brand/logo assets
- Certification assets
- General website media

Images should be optimized for responsive delivery.

Use appropriate image dimensions and formats for:

- Hero
- Product cards
- Product detail gallery
- Mobile layouts
- Admin previews

The implementation must protect Cloudinary credentials and never expose private credentials to the public frontend.

---

# 15. Design System

## 15.1 Design Direction

The website should combine:

- Industrial elegance
- Minimalism
- Editorial typography
- Deep green visual identity
- Strong contrast
- Generous whitespace
- Rounded components
- Restrained gradients
- Subtle motion
- High-quality imagery

The visual language should take inspiration from the supplied Pioneer reference image:

- Deep forest green
- Almost-black green
- Natural olive accents
- White typography
- Subtle warm/metallic highlights
- Dramatic photography

The final interface must remain original.

---

# 16. Color System

The following palette should be treated as the primary design direction.

## Primary Colors

- Deep Black Green: `#020403`
- Deep Forest: `#02150C`
- Primary Forest Green: `#03281A`
- Rich Green: `#063A20`
- Accent Green: `#07552B`
- Muted Olive: `#697057`
- White: `#FFFFFF`
- Off White: `#F4F6F3`

## Suggested Usage

### Dark Sections

Use:

- `#020403`
- `#02150C`
- `#03281A`

for hero, footer, dark banners, and high-impact sections.

### Primary Brand

Use:

- `#03281A`
- `#063A20`

for primary buttons, navigation states, badges, and brand elements.

### Accent

Use:

- `#07552B`
- `#697057`

sparingly for highlights, borders, icons, tags, and secondary emphasis.

### Light Sections

Use:

- `#F4F6F3`
- White

for product grids, informational sections, forms, and content-heavy areas.

---

# 17. Explicit Color Restrictions

The website must **not** use:

- Purple gradients
- Violet gradients
- Blue-purple startup gradients
- Neon purple
- Unrelated pink/purple accents
- Random multicolor gradients
- Rainbow effects
- Generic AI-style purple backgrounds

There should be **no weird purple gradient anywhere in the interface**.

Gradients may only be used when they are extremely subtle and remain within the approved green, black, olive, off-white, or warm metallic visual family.

Examples of acceptable gradient direction:

- Black green → deep forest green
- Deep forest → slightly lighter green
- Off-white → very subtle green-tinted white

Gradients should never become the dominant visual element.

---

# 18. Typography

## Primary Font

**Satoshi, ui-sans-serif, system-ui, sans-serif**

Satoshi should be used as the primary brand typeface.

Fallbacks:

- ui-sans-serif
- system-ui
- sans-serif

## Typography Principles

Use clear hierarchy and disciplined font weights.

Suggested hierarchy:

### Hero Heading

- Extra bold / bold
- Large responsive size
- Tight line height
- Slightly negative letter spacing

### Section Heading

- Bold / semibold
- Strong visual hierarchy
- Tight line height

### Card Titles

- Semibold
- Clear contrast

### Body Text

- Regular
- Comfortable line height
- Moderate width

### Labels

- Medium / semibold
- Small size
- Strong contrast

Avoid using too many font weights.

Recommended weight range:

- 400 Regular
- 500 Medium
- 600 Semibold
- 700 Bold
- 800 Extra Bold where necessary

---

# 19. Layout and Alignment

The interface must use a consistent layout system.

Requirements:

- Consistent max content width
- Consistent horizontal padding
- Strong vertical rhythm
- Consistent card alignment
- Baseline-aligned text where appropriate
- Clear whitespace
- No crowded layouts

Desktop content should generally use a constrained maximum width rather than stretching every section across the entire viewport.

Mobile layouts must prioritize readability over maintaining desktop composition.

---

# 20. Rounded Corners

Rounded corners are a core part of the visual system.

Use rounded corners on:

- Buttons
- Cards
- Inputs
- Image containers
- Modals
- Dropdowns
- Dashboard panels
- Product galleries

Use moderate radii.

The interface should feel refined rather than excessively bubbly.

Avoid making every component extremely rounded or pill-shaped.

Pill shapes should be reserved for:

- Tags
- Status badges
- Small metadata
- Selected filters where appropriate

---

# 21. Buttons

Primary CTA:

- Deep green or approved green
- High contrast text
- Rounded corners
- Medium/semibold typography
- Subtle hover movement
- No excessive glow

Secondary CTA:

- Transparent / outlined / neutral
- Appropriate contrast depending on background

Buttons must have:

- Visible hover state
- Visible focus state
- Disabled state
- Loading state where relevant

Avoid excessive shadows and glowing borders.

---

# 22. Cards

Cards should be:

- Clean
- Spacious
- Lightly bordered or subtly elevated
- Rounded
- Consistently aligned

Avoid heavy shadows.

Product imagery should receive more visual attention than decorative UI effects.

---

# 23. Background Treatment

Backgrounds should primarily use:

- White
- Off-white
- Deep green
- Black-green
- Very subtle green-tinted gradients

Optional subtle decorative elements:

- Soft radial green light
- Very low-opacity industrial texture
- Minimal grid
- Fine lines
- Grain/noise where technically appropriate

Decorative elements must remain secondary.

---

# 24. Motion and Animation

GSAP is intentionally **not required**.

Use Framer Motion or similarly lightweight animation patterns for UI and reveal animations.

## 24.1 Scroll Reveal

Sections should reveal naturally when entering the viewport.

Typical animation:

- Initial opacity reduction
- Small vertical displacement
- Transition to final position
- Optional stagger for cards

Avoid large movement distances.

## 24.2 Page Transitions

Transitions should be:

- Fast
- Smooth
- Subtle

Do not create long transition sequences that make navigation feel slow.

## 24.3 Hover Animations

Product cards may use:

- Slight image scale
- Small translation
- Border transition
- CTA reveal
- Shadow transition

Avoid excessive zoom.

## 24.4 Reduced Motion

Respect users who have enabled reduced motion.

Animations should be reduced or disabled when appropriate.

---

# 25. Responsive Design

The website must work across:

- Large desktop
- Desktop
- Tablet
- Mobile
- Small mobile

Responsive requirements:

- Navigation adapts
- Product grids collapse cleanly
- Hero typography scales
- Images maintain appropriate aspect ratios
- Forms become single-column where needed
- Tables become mobile-friendly
- Admin dashboard adapts to smaller screens
- No horizontal overflow

---

# 26. Accessibility

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- Alt text for meaningful images
- Labels for form fields
- Accessible error messages
- Accessible buttons and controls
- Reduced-motion support
- No information conveyed by color alone

---

# 27. Search

Public search should allow customers to find products by:

- Product name
- Category
- Brand
- Relevant specification
- Product keywords

Search should return useful results quickly.

Empty state:

- Clearly state that no products were found.
- Suggest alternative search terms.
- Provide a way to browse categories.

---

# 28. SEO

The public product catalogue should be SEO-friendly.

Each important page should support:

- Unique page title
- Meta description
- Canonical URL
- Clean URL structure
- Descriptive headings
- Image alt text
- Product-specific metadata
- Category-specific metadata
- Open Graph metadata

Product URLs should be readable and stable.

Example structure:

- `/products`
- `/products/tmt-bars`
- `/products/tmt-bars/8mm-fe500`

Avoid unnecessary query-heavy URLs for primary SEO pages.

---

# 29. Performance

Performance is a priority because the website will contain high-quality industrial imagery.

Requirements:

- Lazy-load non-critical images
- Optimize image delivery through Cloudinary
- Avoid unnecessarily large assets
- Minimize JavaScript
- Avoid excessive animation libraries
- Avoid unnecessary API requests
- Cache appropriate API data
- Use responsive image sizes
- Prevent layout shift
- Prioritize hero content

The homepage should feel fast even on mobile networks.

---

# 30. Authentication and Security

Admin access must be protected.

Requirements:

- Secure authentication
- Password hashing
- Secure session/token handling
- HTTP-only authentication cookies where applicable
- Role/permission checks
- Protected admin routes
- Server-side authorization
- Input validation
- Rate limiting for public enquiry endpoints
- Protection against common injection attacks
- Secure environment variables
- No secrets in frontend code

The backend must never trust authorization information supplied by the client.

---

# 31. API Principles

The backend should expose a clean REST API.

API areas:

- Authentication
- Products
- Categories
- Product variants
- Product images
- Enquiries
- Customers
- Users
- Hero slides
- Website settings
- Dashboard analytics

API responses should be consistent and predictable.

Validation must occur server-side even when frontend validation exists.

---

# 32. Database Model Requirements

The database should conceptually support:

- Administrators/users
- Roles/permissions
- Products
- Categories
- Brands
- Product variants
- Product images
- Customers
- Enquiries
- Enquiry items
- Enquiry status history
- Hero slides
- Website settings
- Contact submissions

The data model must allow future growth without requiring major restructuring.

Product images should be represented as external media references rather than binary database content.

---

# 33. Admin UX Principles

The admin interface should prioritize:

1. Speed
2. Clarity
3. Data visibility
4. Easy editing
5. Safe destructive actions

Admin interface should use:

- Clear tables
- Search
- Filters
- Pagination
- Status badges
- Confirmation dialogs
- Toast notifications
- Empty states
- Loading states
- Error states

Do not over-design the dashboard.

The admin panel is a business tool, not a marketing page.

---

# 34. Forms

Forms should provide:

- Clear labels
- Helpful placeholders only where useful
- Validation
- Inline errors
- Required/optional indicators
- Loading states
- Success feedback
- Error recovery

Public enquiry forms should be short enough that customers actually complete them.

Do not request unnecessary customer information.

---

# 35. Notifications

The initial version should support clear UI feedback.

Possible future notification channels:

- Email notification to admin
- Customer confirmation email
- WhatsApp notification
- SMS
- Internal admin notification

Notification integrations should be designed as replaceable services so additional providers can be introduced later.

---

# 36. Contact and Lead Capture

Contact page should contain:

- Phone
- Email
- Address
- Business hours where applicable
- Contact form
- Map/location where appropriate
- Direct enquiry CTA

Contact submissions should be stored and visible to administrators.

---

# 37. Error Handling

The application must have deliberate states for:

- Loading
- Empty
- Success
- Validation error
- API error
- Network failure
- Not found
- Unauthorized
- Forbidden

Avoid generic browser errors or blank screens.

---

# 38. Product Availability

Product availability should be configurable.

Possible states:

- Available
- Limited Availability
- On Request
- Unavailable
- Discontinued

The system should not display availability claims unless managed by the admin.

---

# 39. Content Rules

All business claims must be supplied or approved by the customer.

Do not invent:

- Certifications
- Years of experience
- Customer counts
- Product specifications
- Brands
- Delivery promises
- Quality claims
- Market position
- Pricing

The admin dashboard should make factual content editable where practical.

---

# 40. Analytics

The first version should capture basic business metrics.

Potential metrics:

- Product views
- Category views
- Enquiry submissions
- Enquiries by product
- Enquiries by category
- Enquiry status distribution
- Conversion progression

Analytics implementation should avoid slowing down the website.

---

# 41. Recommended Component Structure

The UI should be built from reusable components.

Conceptual groups:

### Layout

- Header
- Footer
- Container
- Section
- Navigation

### Marketing

- Hero
- Hero Slider
- CTA
- Statistics
- Trust Section
- Industry Section

### Product

- Product Card
- Product Grid
- Product Gallery
- Product Specifications
- Variant Selector
- Quantity Selector
- Enquiry Form
- Related Products

### Admin

- Sidebar
- Topbar
- Data Table
- Filters
- Status Badge
- Modal
- Form
- File Upload
- Dashboard Metric
- Chart
- Timeline

Avoid duplicated UI logic.

---

# 42. Cloudinary Requirements

Cloudinary is the preferred image/media platform.

Requirements:

- Product image upload
- Product gallery upload
- Hero image upload
- Category image upload
- Image replacement
- Image deletion
- Image ordering
- Responsive image delivery
- Image optimization

Cloudinary credentials must remain server-side.

Database records should retain the required Cloudinary identifiers so images can be replaced or deleted reliably.

---

# 43. Hosting Requirements

The target environment is Hostinger Business Web Hosting with Node.js application support and MySQL.

Deployment architecture:

### Public Frontend

React + Vite production build served as static assets.

### Backend

Node.js + Express application deployed separately as a Node.js application.

### Database

MySQL hosted through Hostinger.

### Media

Cloudinary.

The production system should separate the public frontend origin from the backend API where appropriate, for example using a dedicated API subdomain.

---

# 44. Environment Management

Production secrets must not be committed to source control.

Environment-specific configuration should include:

- Database connection
- Authentication configuration
- Cloudinary credentials
- Application URL
- API URL
- Other external service credentials

Development and production configuration must remain separate.

---

# 45. Deployment Strategy

Recommended flow:

1. Development locally.
2. Push source code to Git repository.
3. Build frontend.
4. Deploy frontend production assets to Hostinger.
5. Deploy Node.js API through Hostinger Node.js application support.
6. Configure MySQL.
7. Configure Cloudinary.
8. Configure environment variables.
9. Configure domain and API subdomain.
10. Configure HTTPS.
11. Test public website.
12. Test admin authentication.
13. Test product management.
14. Test image upload.
15. Test enquiry creation.
16. Test enquiry status updates.
17. Test responsive layouts.
18. Perform final production QA.

---

# 46. Non-Functional Requirements

## Reliability

The application should gracefully handle API/database failures.

## Maintainability

Use clear separation between:

- UI
- API communication
- Business logic
- Database access
- Authentication
- Media services

## Scalability

The architecture should allow:

- More products
- More categories
- More administrators
- More enquiries
- More traffic
- Additional notification providers

without major architectural changes.

## Security

Admin operations and sensitive business data must be protected.

## Performance

Public pages must remain fast despite high-quality imagery and animations.

---

# 47. MVP Scope

The first production release should include:

### Public

- Homepage
- Header
- Hero slider
- Product categories
- Product listing
- Product details
- Product search
- Product variants
- Quantity selection
- Enquiry form
- Contact page
- About page
- Responsive design
- Scroll reveal animations
- SEO metadata

### Admin

- Admin login
- Dashboard
- Product CRUD
- Category CRUD
- Product image management
- Hero slide management
- Enquiry management
- Enquiry status management
- Customer information
- Status history
- Basic dashboard metrics

### Infrastructure

- Node.js API
- MySQL
- Prisma
- Cloudinary
- Hostinger deployment
- Secure environment configuration

---

# 48. Future Scope

Potential future features:

- Customer accounts
- Saved quotations
- Downloadable quotation PDFs
- Formal quotation generation
- WhatsApp integration
- Email automation
- SMS notifications
- Online payment
- Order management
- Delivery tracking
- Dealer portal
- Multiple branches
- Inventory management
- Stock tracking
- Purchase management
- Advanced sales analytics
- CRM integration
- ERP integration
- Multi-language support

These should not complicate the MVP unnecessarily.

---

# 49. Explicitly Out of Scope for MVP

Unless specifically requested by the customer:

- Online payments
- Shopping cart
- Full e-commerce checkout
- Customer account system
- Complex inventory management
- ERP integration
- Multi-vendor functionality
- Cryptocurrency
- Unnecessary real-time systems
- Complex AI features
- Excessive visual effects

The MVP should focus on **catalogue discovery + enquiry conversion + admin workflow**.

---

# 50. UX Quality Bar

The website should feel:

**Premium, minimal, industrial, confident, trustworthy, modern and fast.**

It should not feel:

- Cheap
- Template-like
- Over-animated
- Overly rounded
- Purple/AI-themed
- Visually noisy
- Overloaded with gradients
- Like a generic Shopify store
- Like a gaming website

Every visual element should have a purpose.

---

# 51. Design Reference Interpretation

The supplied Pioneer image should guide the visual atmosphere rather than be copied.

Important visual characteristics to preserve:

- Deep green environment
- Near-black shadows
- Strong white typography
- Natural/organic visual texture
- Subtle olive tones
- High contrast
- Dramatic central imagery
- Minimal UI
- Large typography
- Strong visual hierarchy

The steel website should translate those characteristics into an industrial context using:

- Steel photography
- Structural beams
- TMT bars
- Plates
- Pipes
- Industrial environments
- Fabrication imagery
- Construction imagery

Avoid copying the exact composition, typography, imagery, or branding of the reference.

---

# 52. Acceptance Criteria

The project is considered ready for initial production when:

## Public Website

- Homepage loads correctly on desktop and mobile.
- Hero slider works.
- Hero animation is smooth and short.
- Product categories work.
- Product search works.
- Product details work.
- Variant selection works where applicable.
- Quantity and unit selection work.
- Enquiry submission works.
- Confirmation is shown after submission.
- Contact form works.
- Navigation works.
- SEO metadata exists.
- Responsive layout works without horizontal scrolling.
- Reveal animations work without harming usability.
- Reduced-motion behavior is supported.

## Admin

- Admin authentication works.
- Unauthorized users cannot access protected admin functions.
- Products can be created.
- Products can be edited.
- Products can be archived/deactivated.
- Product images can be uploaded and managed.
- Categories can be managed.
- Hero slides can be managed.
- Enquiries are visible.
- Enquiry details are visible.
- Enquiry status can be changed.
- Status history is recorded.
- Customer information is visible.
- Dashboard metrics are displayed.

## Infrastructure

- MySQL connection works.
- Cloudinary integration works.
- Production environment variables are configured securely.
- Frontend is deployed successfully.
- Node.js API is deployed successfully.
- HTTPS works.
- API communication works in production.
- CORS/security configuration is correct.
- Production error handling is functional.

---

# 53. Development Priorities

Development should proceed in this order:

1. Finalize requirements with the customer.
2. Finalize product/category data structure.
3. Finalize enquiry workflow.
4. Design database architecture.
5. Set up frontend project.
6. Set up backend project.
7. Configure Prisma and MySQL.
8. Implement authentication.
9. Implement product/category APIs.
10. Implement enquiry APIs.
11. Implement Cloudinary integration.
12. Build admin dashboard.
13. Build public product catalogue.
14. Build product detail/enquiry experience.
15. Build homepage.
16. Add visual polish and animations.
17. Implement SEO.
18. Optimize performance.
19. Perform responsive QA.
20. Deploy to Hostinger.
21. Perform production testing.
22. Launch.

The project should not begin with visual animation work before the core data and business workflows are stable.

---

# 54. Final Product Principle

The website is fundamentally a **digital sales and enquiry platform for a steel business**, wrapped in a premium brand experience.

The visual design should attract attention, but the underlying system must make it extremely easy for:

**Customers to request steel → Sales teams to receive enquiries → Admins to manage the pipeline → Business owners to understand what is happening.**

The product should favor clarity, reliability, speed, and maintainability over unnecessary technical or visual complexity.

---

# Appendix A — Initial Brand Palette

| Token | Color | Intended Use |
|---|---|---|
| Deep Black Green | #020403 | Deep backgrounds |
| Deep Forest | #02150C | Hero/footer |
| Primary Forest | #03281A | Primary brand |
| Rich Green | #063A20 | Secondary brand |
| Accent Green | #07552B | CTAs/highlights |
| Muted Olive | #697057 | Secondary accents |
| White | #FFFFFF | Primary light surface/text |
| Off White | #F4F6F3 | Light backgrounds |

**Purple/violet/blue-purple gradients are prohibited.**

---

# Appendix B — Typography

**Primary family:** Satoshi, ui-sans-serif, system-ui, sans-serif

Recommended hierarchy:

- Display: 700–800
- H1/H2: 700
- H3/H4: 600–700
- Body: 400
- Supporting text: 400–500
- Labels: 500–600
- Buttons: 600

Typography must prioritize:

- Strong hierarchy
- Consistent spacing
- Comfortable reading width
- Proper line height
- Consistent alignment

---

# Appendix C — Technical Stack Summary

| Area | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Animation | Framer Motion |
| Routing | React Router |
| Data Fetching | TanStack Query |
| Forms | React Hook Form |
| Backend | Node.js |
| API Framework | Express |
| Backend Language | TypeScript |
| Validation | Zod |
| ORM | Prisma |
| Database | MySQL |
| Image/Media | Cloudinary |
| Hosting | Hostinger |
| Source Control | Git |

---

# Appendix D — Core Success Metrics

The business should eventually track:

- Product page views
- Product enquiry rate
- Total enquiries
- Qualified enquiries
- Enquiries by category
- Enquiries by product
- Enquiries by source
- Enquiry response time
- Quotation rate
- Confirmation rate
- Completed enquiry count

The most important MVP metric is:

**How effectively does the website convert relevant product visitors into useful sales enquiries?**
