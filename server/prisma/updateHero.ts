import prisma from '../src/config/db';

async function updateHero() {
  await prisma.heroSlide.deleteMany({});
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'BUILT FOR STRENGTH. ENGINEERED FOR SCALE.',
        subtitle:
          'Premier industrial distributor of certified high-strength steel rebars, structural beams, and heavy-duty steel products direct from top steel manufacturers.',
        bgImageUrl: '/hero-1.png',
        primaryCtaText: 'Explore Products',
        primaryCtaLink: '/products',
        secondaryCtaText: 'Request a Quote',
        secondaryCtaLink: '/quote',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'HEAVY STRUCTURAL BEAMS. MEGA SCALE INFRASTRUCTURE.',
        subtitle:
          'Supplying high-tensile parallel beams, columns, and heavy fabrication sections for commercial towers, bridges, and industrial plants.',
        bgImageUrl: '/hero-2.png',
        primaryCtaText: 'View Structural Steel',
        primaryCtaLink: '/products',
        secondaryCtaText: 'Quality Standards',
        secondaryCtaLink: '/quality',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'AUTOMATED MILL ROLLING. ZERO COMPROMISE ON QUALITY.',
        subtitle:
          'Direct factory dispatches with 100% verified test certificates, precision digital weighment, and on-time site logistics.',
        bgImageUrl: '/hero-3.png',
        primaryCtaText: 'Request a Quote',
        primaryCtaLink: '/quote',
        secondaryCtaText: 'Explore Catalog',
        secondaryCtaLink: '/products',
        displayOrder: 3,
        isActive: true,
      },
    ],
  });
  console.log('Hero slides successfully updated with new images in MySQL!');
}

updateHero()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
