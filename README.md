# Apex Steel — Premium B2B Steel Catalogue & Enquiry Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B-063A20.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%20(XAMPP)-07552B.svg)](https://www.apachefriends.org/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-02150C.svg)](https://www.prisma.io/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20TS-03281A.svg)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-07552B.svg)](https://tailwindcss.com/)

> A state-of-the-art, high-performance digital sales and quotation platform designed specifically for commercial steel stockists, primary mill distributors, and infrastructure supply contractors.

---

## 📌 Project Overview

Unlike generic consumer e-commerce stores with traditional shopping carts and immediate checkout, the **Apex Steel Platform** is engineered around a **Product Catalogue + Structured Commercial Quotation Pipeline**.

Contractors, civil builders, and industrial procurement teams can browse primary mill steel materials, filter by technical standards (BIS 1786, IS 2062), select dimensional variants (rebar diameters, structural beam sizes, plate thicknesses), specify quantity and unit, and request commercial quotes directly.

Administrators and sales teams manage the entire enquiry lifecycle from an integrated back-office desk with live status progression, audit timelines, and analytics.

---

## 🏗 System Architecture

```
                                  +---------------------------------------+
                                  |     React 18 + Vite + TypeScript      |
                                  |  Tailwind CSS • Satoshi • Framer UI   |
                                  +---------------------------------------+
                                        |                           |
                            (REST / Axios)                (Admin Portal)
                                        |                           |
                                        v                           v
                                  +---------------------------------------+
                                  |     Node.js + Express + TypeScript    |
                                  |  Zod Validation • JWT • RBAC Security |
                                  +---------------------------------------+
                                        |                           |
                               (Prisma ORM)                (Cloudinary API)
                                        |                           |
                                        v                           v
                      +-----------------------------+    +----------------------+
                      |      MySQL Database         |    |   Media & Stock      |
                      | (Local XAMPP: 3306 / Hostinger) |    |  Steel Photography   |
                      +-----------------------------+    +----------------------+
```

---

## 🎨 Visual Identity & Design System

The platform strictly adheres to an **Industrial Luxury** aesthetic inspired by precision engineering:
- **Typography:** **Satoshi** font family paired with high-contrast, disciplined sans-serif weights.
- **Color Tokens:**
  - `Deep Black Green`: `#020403`
  - `Deep Forest`: `#02150C`
  - `Primary Forest Green`: `#03281A`
  - `Rich Green`: `#063A20`
  - `Accent Green`: `#07552B`
  - `Muted Olive`: `#697057`
  - `Off White (Light Surface)`: `#F4F6F3`
  - `Pure White`: `#FFFFFF`
  - **Zero purple/violet gradients.**
- **Mobile First:** Responsive layouts supporting 320px mobile screens, tablets, and 4K displays with accessible touch targets (>44px).

---

## 🚀 Key Features

### 1. Public Experience & Conversion Engine
* **Dynamic Hero Slider:** Visual banners with auto-rotation, Satoshi display headlines, and smooth Framer Motion entrance reveals.
* **Steel Category Explorer:** Interactive portfolio covering TMT Rebars, Heavy Structural Joists & Beams, Hot Rolled Plates, and Hollow Tubes (SHS/RHS).
* **Live Product Search & Filters:** Instant debounced search querying product titles, grades, categories, and technical standards.
* **Product Detail & Variant Selector:** High-resolution image galleries with multi-dimensional variant pills (diameter, grade, length, size, weight/meter).
* **Rapid Quotation Engine:** Modal and inline quotation forms with automatic reference number generation (`ENQ-YYYYMMDD-XXXX`).
* **Corporate & Trust Pages:** Dedicated pages for Company Infrastructure, Sectors Served (Highways, PEB, Metro Rail), Quality Standards (UTM tests, chemical spectrometry, MTC certificates), and Interactive Contact.

### 2. Admin Operations Desk
* **Protected Role-Based Access Control:** Secure JWT authentication supporting `SUPER_ADMIN`, `ADMIN`, and `STAFF` roles.
* **Executive Dashboard:** Live metrics for total enquiries, new requests, quotation progression, active inventory, and conversion rates.
* **Product & Variant Matrix Manager:** Add/edit products with dynamic key-value specifications and multi-dimensional variant configurations.
* **Category & Hero Slide CMS:** Manage website categories, display order, banner imagery, and call-to-action destinations.
* **Enquiry Pipeline & Timeline Audit:** Track leads through standard statuses: `NEW` ➔ `CONTACTED` ➔ `QUOTATION_SENT` ➔ `NEGOTIATION` ➔ `CONFIRMED` ➔ `COMPLETED` / `CANCELLED`, recording timestamped notes and staff assignments.
* **Customer Directory:** Aggregated database of contractors and procurement managers with historical enquiry counts.
* **Website Settings:** Direct control over sales desk hotlines, yard addresses, working hours, and homepage metrics.

---

## 📂 Repository Structure

```
Steels/
├── package.json               # Root scripts (runs concurrent client & server)
├── .gitignore                 # Excludes node_modules, dist, .env, and local database files
├── README.md                  # System overview & installation documentation
├── prompts.md                 # 13-phase master engineering prompts guide
├── Steel_Company_Website_PRD.md # Product Requirements Document
│
├── server/                    # Node.js + Express + TypeScript Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma      # MySQL Relational Schema
│   │   └── seed.ts            # Database seed script with steel stock imagery
│   └── src/
│       ├── app.ts             # Express application & middleware setup
│       ├── server.ts          # Server entry point
│       ├── config/            # Prisma Client and Cloudinary configs
│       ├── middleware/        # Auth, RBAC, Validation, Error handling, Multer
│       ├── utils/             # ApiResponse & ApiError helpers
│       └── modules/           # Feature modules
│           ├── auth/          # Authentication & User Management
│           ├── products/      # Products, Variants & Specs
│           ├── categories/    # Product Categories
│           ├── brands/        # Manufacturer Brands
│           ├── hero-slides/   # Hero Slider CMS
│           ├── enquiries/     # Quotation & Status History Engine
│           ├── customers/     # Customer Leads Directory
│           ├── settings/      # Site Content Settings
│           ├── contact/       # Contact Form Submissions
│           ├── analytics/     # Executive Dashboard Analytics
│           └── media/         # Cloudinary File Uploads
│
└── client/                    # React + Vite + TypeScript Frontend
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js     # Steel design tokens & Satoshi typography
    ├── index.html
    └── src/
        ├── App.tsx            # Full React router setup
        ├── index.css          # Tailwind base & custom industrial scrollbar
        ├── types/             # TypeScript interfaces
        ├── lib/               # Axios API client & utils
        ├── context/           # Toast & AdminAuth contexts
        ├── components/
        │   ├── ui/            # Atomic Button, Input, Select, Modal, Badge
        │   ├── layout/        # Header, Footer, PublicLayout
        │   ├── home/          # Hero, CategoryGrid, Featured, WhyUs, Stats
        │   └── enquiry/       # QuickQuoteModal & Enquiry forms
        ├── pages/             # Public pages (Home, Products, Details, Quote, etc.)
        └── admin/             # Admin portal (Dashboard, Products, Enquiries, etc.)
```

---

## 🛠 Local Setup & Installation

### 1. Prerequisites
- **Node.js:** v18+ or v20+
- **MySQL:** Local MySQL server running (e.g. via **XAMPP** on port `3306`)

### 2. Database Setup (XAMPP)
1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Ensure MySQL is accessible at `localhost:3306` with user `root` and an empty password.
3. The database `steel_company_db` will be automatically initialized or can be created in phpMyAdmin.

### 3. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Aswinsaipalakonda/Steels.git
cd Steels

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 4. Configure Environment Variables
Inside `server/`, create a `.env` file (refer to `.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Local XAMPP MySQL connection
DATABASE_URL="mysql://root:@localhost:3306/steel_company_db"

# JWT Authentication
JWT_SECRET=steel_industrial_jwt_super_secret_key_2026_modern
JWT_EXPIRES_IN=7d

# Cloudinary (Optional - Stock imagery is bundled by default)
CLOUDINARY_CLOUD_NAME=steel_demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=steel_demo_secret
```

### 5. Run Migrations & Seed Database
```bash
cd server

# Synchronize Prisma schema with MySQL
npx prisma db push

# Seed database with stock imagery, categories, products, and admin accounts
npm run prisma:seed

cd ..
```

### 6. Start the Full Application
From the project root:
```bash
npm run dev
```
- **Public Website:** [http://localhost:5173/](http://localhost:5173/)
- **Admin Portal:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 🔐 Default Admin Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@steelplatform.com` | `Password@123` |
| **Sales Staff** | `sales@steelplatform.com` | `Password@123` |

---

## 🌐 Production Deployment (Hostinger Business Web Hosting)

1. **Frontend Build:** Run `npm run build` in `client/` to generate optimized production assets in `client/dist/`.
2. **Backend Build:** Run `npm run build` in `server/` to compile TypeScript to `server/dist/`.
3. **Database:** Create a MySQL database in Hostinger hPanel and update `DATABASE_URL` in production environment variables.
4. **Prisma:** Run `npx prisma migrate deploy` on the production server.
5. **Node.js App:** Deploy the Node.js application using Hostinger's Node.js application manager pointing entry to `dist/server.js`.

---

## 📄 License
This project is licensed under the MIT License.
