import prisma from '../src/config/db';

async function seedBrands() {
  const brands = [
    {
      name: 'Tata Steel',
      slug: 'tata-steel',
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=400&q=80',
      description: 'IS 1786 Certified • Tiscon 550D & Heavy Sections Direct Mill Dispatch',
      isActive: true,
    },
    {
      name: 'JSW Steel',
      slug: 'jsw-steel',
      logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      description: 'IS 2062 Grade • Neosteel High-Yield Earthquake Resistant TMT',
      isActive: true,
    },
    {
      name: 'SAIL',
      slug: 'sail',
      logoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      description: 'Heavy Industrial Boiler & Ship-Building Quality Structural Plates',
      isActive: true,
    },
    {
      name: 'Jindal Steel & Power',
      slug: 'jindal-steel-power',
      logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      description: 'Jindal Panther 550D & High-Tensile Structural Parallel Beams',
      isActive: true,
    },
    {
      name: 'AM/NS India',
      slug: 'amns-india',
      logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      description: 'ArcelorMittal Nippon Steel • Premium HR Coils & Galvanized Sheets',
      isActive: true,
    },
    {
      name: 'RINL Vizag Steel',
      slug: 'rinl-vizag-steel',
      logoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80',
      description: 'Rashtriya Ispat Nigam • Premium Wire Rods & Heavy Structural Angles',
      isActive: true,
    },
    {
      name: 'APL Apollo Tubes',
      slug: 'apl-apollo-tubes',
      logoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      description: 'Heavy Duty Hollow Sections, Rectangular & Square Structural Pipes',
      isActive: true,
    },
  ];

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { description: b.description, isActive: true },
      create: b,
    });
  }

  const all = await prisma.brand.findMany({ select: { name: true, slug: true } });
  console.log('Successfully seeded partner brands:', all.length, all.map(a => a.name));
}

seedBrands()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
