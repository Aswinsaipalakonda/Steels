import { PrismaClient, Role, AvailabilityStatus, EnquiryStatus, SettingGroup } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with initial data and high-res steel stock imagery...');

  // 1. Create Super Admin user
  const passwordHash = await bcrypt.hash('Password@123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@steelplatform.com' },
    update: {},
    create: {
      email: 'admin@steelplatform.com',
      name: 'Executive Super Admin',
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'sales@steelplatform.com' },
    update: {},
    create: {
      email: 'sales@steelplatform.com',
      name: 'Rajesh Sharma (Sales Desk)',
      passwordHash,
      role: Role.STAFF,
      isActive: true,
    },
  });

  console.log(`Created default users: ${superAdmin.email}, ${staffUser.email}`);

  // 2. Create Brands
  const tata = await prisma.brand.upsert({
    where: { slug: 'tata-steel' },
    update: {},
    create: {
      name: 'Tata Steel',
      slug: 'tata-steel',
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=400&q=80',
      description: 'Global steel leader providing primary grade TMT and structural materials.',
    },
  });

  const jsw = await prisma.brand.upsert({
    where: { slug: 'jsw-steel' },
    update: {},
    create: {
      name: 'JSW Steel',
      slug: 'jsw-steel',
      logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      description: 'India’s leading integrated steel manufacturer with advanced rolling mills.',
    },
  });

  const sail = await prisma.brand.upsert({
    where: { slug: 'sail' },
    update: {},
    create: {
      name: 'SAIL',
      slug: 'sail',
      logoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      description: 'Steel Authority of India Limited - premier heavy industrial steel producer.',
    },
  });

  // 3. Create Categories with authentic high-res steel images
  const catTMT = await prisma.category.upsert({
    where: { slug: 'tmt-rebars' },
    update: {},
    create: {
      name: 'TMT Rebars',
      slug: 'tmt-rebars',
      description: 'High-yield thermo-mechanically treated reinforcement steel bars engineered for superior tensile strength and earthquake resistance.',
      imageUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1000&q=80',
      displayOrder: 1,
    },
  });

  const catStructural = await prisma.category.upsert({
    where: { slug: 'structural-steel' },
    update: {},
    create: {
      name: 'Structural Steel',
      slug: 'structural-steel',
      description: 'Heavy duty I-Beams, H-Beams, Channels, and Angles for multi-story buildings, industrial sheds, and civil infrastructure.',
      imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
      displayOrder: 2,
    },
  });

  const catPlates = await prisma.category.upsert({
    where: { slug: 'steel-plates-coils' },
    update: {},
    create: {
      name: 'Steel Plates & Coils',
      slug: 'steel-plates-coils',
      description: 'Hot rolled and cold rolled high-grade carbon steel plates, chequered plates, and slit coils for heavy manufacturing.',
      imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80',
      displayOrder: 3,
    },
  });

  const catPipes = await prisma.category.upsert({
    where: { slug: 'pipes-hollow-sections' },
    update: {},
    create: {
      name: 'Pipes & Hollow Sections',
      slug: 'pipes-hollow-sections',
      description: 'Circular, square, and rectangular structural hollow sections (SHS/RHS) with precision tolerance and high torsion strength.',
      imageUrl: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=1000&q=80',
      displayOrder: 4,
    },
  });

  // 4. Products, Specifications & Variants
  // Product 1: Fe 500D TMT Bar
  const prodTmt500D = await prisma.product.upsert({
    where: { slug: 'fe-500d-tmt-rebar' },
    update: {},
    create: {
      name: 'Fe 500D High Ductility TMT Rebar',
      slug: 'fe-500d-tmt-rebar',
      categoryId: catTMT.id,
      brandId: tata.id,
      shortDescription: 'Primary mill BIS 1786 certified TMT bar featuring 16% elongation and superior weldability for seismic zone safety.',
      fullDescription: 'Manufactured through continuous tempcore quenching and self-tempering process, ensuring a tough outer martensitic rim and ductile ferritic-pearlitic core. Ideal for high-rise commercial structures, bridges, flyovers, and industrial foundations.',
      primarySpecification: 'IS 1786:2008 Grade Fe 500D',
      availableUnits: 'MT, Bundles, Pieces, KG',
      isFeatured: true,
      displayOrder: 1,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
            altText: 'Stacked bundles of Fe 500D TMT steel bars ready for dispatch',
            isPrimary: true,
            displayOrder: 1,
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f3?auto=format&fit=crop&w=1200&q=80',
            altText: 'Close up view of high-grip rib pattern on TMT rebar',
            isPrimary: false,
            displayOrder: 2,
          },
        ],
      },
      specifications: {
        create: [
          { specKey: 'Standard', specValue: 'IS 1786: 2008', displayOrder: 1 },
          { specKey: 'Yield Strength (Min)', specValue: '500 N/mm²', displayOrder: 2 },
          { specKey: 'Tensile Strength (Min)', specValue: '565 N/mm²', displayOrder: 3 },
          { specKey: 'Elongation (Min)', specValue: '16.0%', displayOrder: 4 },
          { specKey: 'Standard Length', specValue: '12.0 Meters', displayOrder: 5 },
          { specKey: 'Carbon Equivalent', specValue: '0.42% Max', displayOrder: 6 },
        ],
      },
      variants: {
        create: [
          { name: '8mm Fe 500D', diameter: '8mm', grade: 'Fe 500D', length: '12m', sku: 'TMT-8MM-500D' },
          { name: '10mm Fe 500D', diameter: '10mm', grade: 'Fe 500D', length: '12m', sku: 'TMT-10MM-500D' },
          { name: '12mm Fe 500D', diameter: '12mm', grade: 'Fe 500D', length: '12m', sku: 'TMT-12MM-500D' },
          { name: '16mm Fe 500D', diameter: '16mm', grade: 'Fe 500D', length: '12m', sku: 'TMT-16MM-500D' },
          { name: '20mm Fe 500D', diameter: '20mm', grade: 'Fe 500D', length: '12m', sku: 'TMT-20MM-500D' },
          { name: '25mm Fe 500D', diameter: '25mm', grade: 'Fe 500D', length: '12m', sku: 'TMT-25MM-500D' },
          { name: '32mm Fe 500D', diameter: '32mm', grade: 'Fe 500D', length: '12m', sku: 'TMT-32MM-500D' },
        ],
      },
    },
  });

  // Product 2: ISMB Heavy Structural I-Beam
  const prodBeam = await prisma.product.upsert({
    where: { slug: 'ismb-structural-i-beam' },
    update: {},
    create: {
      name: 'ISMB Heavy Structural I-Beam',
      slug: 'ismb-structural-i-beam',
      categoryId: catStructural.id,
      brandId: sail.id,
      shortDescription: 'Hot-rolled structural steel I-beams conforming to IS 2062 Grade E250 / E350 for load-bearing framing.',
      fullDescription: 'High load capacity structural joists featuring uniform flange thickness and high section modulus. Supplied with full Mill Test Certificates for infrastructure, warehouse pre-engineered buildings (PEB), and industrial gantry girders.',
      primarySpecification: 'IS 2062:2011 Grade E250/E350',
      availableUnits: 'MT, Pieces, Meters',
      isFeatured: true,
      displayOrder: 2,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
            altText: 'Heavy industrial steel I-beams stored in distribution yard',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
      specifications: {
        create: [
          { specKey: 'Specification', specValue: 'IS 2062: 2011 Grade E250', displayOrder: 1 },
          { specKey: 'Tensile Strength', specValue: '410 MPa', displayOrder: 2 },
          { specKey: 'Yield Stress', specValue: '250 MPa', displayOrder: 3 },
          { specKey: 'Standard Length', specValue: '11m - 12m', displayOrder: 4 },
        ],
      },
      variants: {
        create: [
          { name: 'ISMB 150 (150 x 80 mm)', size: '150x80mm', weight: '15.0 kg/m', sku: 'BEAM-ISMB-150' },
          { name: 'ISMB 200 (200 x 100 mm)', size: '200x100mm', weight: '25.4 kg/m', sku: 'BEAM-ISMB-200' },
          { name: 'ISMB 250 (250 x 125 mm)', size: '250x125mm', weight: '37.3 kg/m', sku: 'BEAM-ISMB-250' },
          { name: 'ISMB 300 (300 x 140 mm)', size: '300x140mm', weight: '44.2 kg/m', sku: 'BEAM-ISMB-300' },
          { name: 'ISMB 400 (400 x 140 mm)', size: '400x140mm', weight: '61.6 kg/m', sku: 'BEAM-ISMB-400' },
        ],
      },
    },
  });

  // Product 3: Hot Rolled Mild Steel Plates
  await prisma.product.upsert({
    where: { slug: 'hot-rolled-mild-steel-plates' },
    update: {},
    create: {
      name: 'Hot Rolled High Grade MS Steel Plates',
      slug: 'hot-rolled-mild-steel-plates',
      categoryId: catPlates.id,
      brandId: jsw.id,
      shortDescription: 'Industrial grade hot rolled mild steel plates with tight thickness tolerance and smooth surface finish.',
      fullDescription: 'Custom sheared and slit plates for boiler fabrication, pressure vessels, shipbuilding, heavy industrial equipment, and earth-moving machinery chassis.',
      primarySpecification: 'IS 2062 E250A / ASTM A36',
      availableUnits: 'MT, Pieces, KG',
      isFeatured: true,
      displayOrder: 3,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80',
            altText: 'Hot rolled carbon steel plate stack in warehouse',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
      specifications: {
        create: [
          { specKey: 'Grade', specValue: 'IS 2062 Grade E250A / E350', displayOrder: 1 },
          { specKey: 'Width', specValue: '1250mm, 1500mm, 2000mm, 2500mm', displayOrder: 2 },
          { specKey: 'Length', specValue: '6000mm, 12000mm or Custom Cut', displayOrder: 3 },
          { specKey: 'Surface Condition', specValue: 'Shot Blasted / Mill Scale Cleaned', displayOrder: 4 },
        ],
      },
      variants: {
        create: [
          { name: '5mm Thickness MS Plate', thickness: '5mm', grade: 'IS 2062', sku: 'PLT-5MM' },
          { name: '8mm Thickness MS Plate', thickness: '8mm', grade: 'IS 2062', sku: 'PLT-8MM' },
          { name: '10mm Thickness MS Plate', thickness: '10mm', grade: 'IS 2062', sku: 'PLT-10MM' },
          { name: '12mm Thickness MS Plate', thickness: '12mm', grade: 'IS 2062', sku: 'PLT-12MM' },
          { name: '16mm Thickness MS Plate', thickness: '16mm', grade: 'IS 2062', sku: 'PLT-16MM' },
          { name: '20mm Thickness MS Plate', thickness: '20mm', grade: 'IS 2062', sku: 'PLT-20MM' },
          { name: '25mm Thickness MS Plate', thickness: '25mm', grade: 'IS 2062', sku: 'PLT-25MM' },
        ],
      },
    },
  });

  // Product 4: Structural Hollow Section Pipes
  await prisma.product.upsert({
    where: { slug: 'structural-rectangular-hollow-sections' },
    update: {},
    create: {
      name: 'Rectangular & Square Structural Hollow Sections (RHS/SHS)',
      slug: 'structural-rectangular-hollow-sections',
      categoryId: catPipes.id,
      brandId: tata.id,
      shortDescription: 'High torsional strength hollow steel tubes for architectural columns, truss roofs, and automotive chassis.',
      fullDescription: 'Precision engineered structural tubes complying with IS 4923. Provides a high strength-to-weight ratio and clean aesthetic finish for modern industrial architecture.',
      primarySpecification: 'IS 4923:1997 / YST 310',
      availableUnits: 'MT, Pieces, Meters',
      isFeatured: true,
      displayOrder: 4,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=1200&q=80',
            altText: 'Stack of structural hollow square and rectangular steel pipes',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
      specifications: {
        create: [
          { specKey: 'Specification', specValue: 'IS 4923 / EN 10219', displayOrder: 1 },
          { specKey: 'Grade', specValue: 'YST 210 / YST 240 / YST 310', displayOrder: 2 },
          { specKey: 'Standard Length', specValue: '6.0 Meters / Custom', displayOrder: 3 },
        ],
      },
      variants: {
        create: [
          { name: '50 x 50 x 3.2 mm SHS', size: '50x50mm', thickness: '3.2mm', sku: 'SHS-50-50' },
          { name: '80 x 80 x 4.0 mm SHS', size: '80x80mm', thickness: '4.0mm', sku: 'SHS-80-80' },
          { name: '100 x 50 x 4.5 mm RHS', size: '100x50mm', thickness: '4.5mm', sku: 'RHS-100-50' },
          { name: '150 x 100 x 5.0 mm RHS', size: '150x100mm', thickness: '5.0mm', sku: 'RHS-150-100' },
        ],
      },
    },
  });

  // 5. Hero Slides with high visual impact steel stock photography
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'BUILT FOR STRENGTH. ENGINEERED FOR SCALE.',
        subtitle: 'Leading industrial distributor of certified primary TMT rebars, heavy structural beams, and precision steel products direct from primary mills.',
        bgImageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=85',
        primaryCtaText: 'Explore Products',
        primaryCtaLink: '/products',
        secondaryCtaText: 'Request a Quote',
        secondaryCtaLink: '/quote',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'PRIMARY MILL DIRECT. ZERO COMPROMISE.',
        subtitle: 'Supplying certified steel infrastructure materials to commercial towers, highways, bridges, and heavy industrial fabrication facilities across the nation.',
        bgImageUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1920&q=85',
        primaryCtaText: 'View TMT Bars',
        primaryCtaLink: '/products?category=tmt-rebars',
        secondaryCtaText: 'Download Specs',
        secondaryCtaLink: '/quality',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'PRECISION STRUCTURAL SOLUTIONS.',
        subtitle: 'Complete inventory of heavy ISMB joists, channels, angles, and boiler-grade plates cut to your project specifications with certified weighment.',
        bgImageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1920&q=85',
        primaryCtaText: 'Structural Catalog',
        primaryCtaLink: '/products?category=structural-steel',
        secondaryCtaText: 'Get Mill Direct Rates',
        secondaryCtaLink: '/quote',
        displayOrder: 3,
        isActive: true,
      },
    ],
  });

  // 6. Website Settings
  await prisma.websiteSetting.createMany({
    data: [
      { key: 'company_name', value: 'Steels Industrial Supply Ltd.', group: SettingGroup.GENERAL },
      { key: 'company_tagline', value: 'Prime Quality Industrial Steel Distribution', group: SettingGroup.GENERAL },
      { key: 'contact_phone', value: '+91 98765 43210', group: SettingGroup.CONTACT },
      { key: 'contact_email', value: 'sales@steelplatform.com', group: SettingGroup.CONTACT },
      { key: 'contact_address', value: 'Plot 42, Heavy Industrial Area, Steel Hub Phase II, Mumbai - 400072', group: SettingGroup.CONTACT },
      { key: 'working_hours', value: 'Monday - Saturday: 8:00 AM - 7:30 PM', group: SettingGroup.CONTACT },
      { key: 'stat_tons_supplied', value: '500,000+ MT', group: SettingGroup.STATS },
      { key: 'stat_projects_completed', value: '1,250+ Projects', group: SettingGroup.STATS },
      { key: 'stat_years_experience', value: '28+ Years', group: SettingGroup.STATS },
      { key: 'stat_cities_served', value: '120+ Cities', group: SettingGroup.STATS },
    ],
  });

  // 7. Initial Sample Customer and Enquiry
  const sampleCustomer = await prisma.customer.create({
    data: {
      name: 'Vikas Construction & Infra Ltd',
      email: 'procurement@vikasinfra.com',
      phone: '+91 98200 11223',
      company: 'Vikas Infrastructure Projects',
      location: 'Pune Metro Rail Expansion Site, Yard 4',
      notes: 'Tier 1 Infrastructure contractor. Regularly requires 12mm & 16mm TMT rebars.',
    },
  });

  const sampleVariant = await prisma.productVariant.findFirst({
    where: { productId: prodTmt500D.id, diameter: '16mm' },
  });

  const sampleEnquiry = await prisma.enquiry.create({
    data: {
      enquiryNumber: 'ENQ-20260910-001',
      customerId: sampleCustomer.id,
      productId: prodTmt500D.id,
      variantId: sampleVariant?.id,
      quantity: 45.0,
      unit: 'MT',
      location: 'Pune Metro Corridor 2, Hinjewadi Phase 3',
      message: 'Need 45 Metric Tons of 16mm Fe 500D TMT bars delivered in 3 scheduled dispatches. Please share test certificate with quote.',
      sourcePage: '/products/fe-500d-tmt-rebar',
      status: EnquiryStatus.NEW,
      assignedUserId: staffUser.id,
      internalNotes: 'First contact priority: high. Dispatches required by end of month.',
    },
  });

  await prisma.enquiryStatusHistory.create({
    data: {
      enquiryId: sampleEnquiry.id,
      previousStatus: EnquiryStatus.NEW,
      newStatus: EnquiryStatus.NEW,
      changedById: staffUser.id,
      note: 'Enquiry received from website product detail page. Assigned to sales desk.',
    },
  });

  console.log('Seed completed successfully with initial products, categories, hero slides, and enquiries.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
