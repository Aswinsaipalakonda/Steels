import prisma from '../src/config/db';

async function seedBrands() {
  const brands = [
    {
      name: 'Vizag Steel',
      slug: 'vizag-steel',
      logoUrl: '',
      description: 'Rashtriya Ispat Nigam • VIZAG Steel Pride of Steel Wire Rods & Heavy Structural Angles',
      isActive: true,
    },
    {
      name: 'Tata Steel',
      slug: 'tata-steel',
      logoUrl: '',
      description: 'IS 1786 Certified • Tata Steel Construction Rebars & Heavy Sections Direct Mill Dispatch',
      isActive: true,
    },
    {
      name: 'Jindal Panther',
      slug: 'jindal-panther',
      logoUrl: '',
      description: 'Jindal Panther 550D TMT Rebars & High-Tensile Structural Parallel Beams',
      isActive: true,
    },
    {
      name: 'Essar Steel',
      slug: 'essar-steel',
      logoUrl: '',
      description: 'Essar Steel High Quality Flat Products, Heavy Plates & Galvanized Coils',
      isActive: true,
    },
    {
      name: 'JSW Neo',
      slug: 'jsw-neo',
      logoUrl: '',
      description: 'IS 2062 Grade • JSW Neosteel Pure TMT Bars Earthquake Resistant Construction',
      isActive: true,
    },
    {
      name: 'Kamachi TMT',
      slug: 'kamachi-tmt',
      logoUrl: '',
      description: 'Kamachi TMT Bars • The Soul of Steel High Strength TMT Construction Steel',
      isActive: true,
    },
    {
      name: 'SAIL',
      slug: 'sail',
      logoUrl: '',
      description: 'Steel Authority of India • Heavy Industrial Boiler & Ship-Building Quality Plates & Beams',
      isActive: true,
    },
    {
      name: 'APL Apollo',
      slug: 'apl-apollo',
      logoUrl: '',
      description: 'APL Apollo Steel Tubes • Heavy Duty Hollow Sections, Rectangular & Square Structural Pipes',
      isActive: true,
    },
    {
      name: 'Shyam Steel',
      slug: 'shyam-steel',
      logoUrl: '',
      description: 'Shyam Steel Flexi-Strong TMT Rebars & Structural Steel Infrastructure',
      isActive: true,
    },
    {
      name: 'Electrosteel',
      slug: 'electrosteel',
      logoUrl: '',
      description: 'Electrosteel Steels (ESL) • A Vedanta Company Certified Ductile Iron & Construction Steel',
      isActive: true,
    },
    {
      name: 'Tata Tiscon',
      slug: 'tata-tiscon',
      logoUrl: '',
      description: 'Tata Tiscon 550D Super Ductile Earthquake Resistant Green Steel Rebars',
      isActive: true,
    },
    {
      name: 'AM/NS India',
      slug: 'amns-india',
      logoUrl: '',
      description: 'ArcelorMittal Nippon Steel • Premium HR Coils & Cold-Rolled Galvanized Sheets',
      isActive: true,
    },
  ];

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, description: b.description, isActive: true },
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
