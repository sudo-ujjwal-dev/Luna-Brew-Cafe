const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Coffee', slug: 'coffee', sortOrder: 1 },
  { name: 'Tea', slug: 'tea', sortOrder: 2 },
  { name: 'Breakfast', slug: 'breakfast', sortOrder: 3 },
  { name: 'Snacks', slug: 'snacks', sortOrder: 4 },
  { name: 'Main Meals', slug: 'main-meals', sortOrder: 5 },
  { name: 'Desserts', slug: 'desserts', sortOrder: 6 },
  { name: 'Cold Drinks', slug: 'cold-drinks', sortOrder: 7 },
];

const items = [
  [
    'luna-signature-espresso',
    'Luna Signature Espresso',
    'Double espresso with cocoa and citrus notes.',
    180,
    'coffee',
    true,
    true,
    true,
    true,
    '/images/menu/luna-signature-espresso.jpg',
  ],
  [
    'flat-white',
    'Flat White',
    'Espresso with smooth steamed milk.',
    240,
    'coffee',
    true,
    false,
    false,
    false,
    '/images/menu/flat-white.jpg',
  ],
  [
    'oat-cappuccino',
    'Oat Milk Cappuccino',
    'Cappuccino prepared with oat milk.',
    280,
    'coffee',
    true,
    false,
    true,
    true,
    '/images/menu/oat-cappuccino.jpg',
  ],
  [
    'masala-chai',
    'Masala Chai',
    'Black tea simmered with milk and warming spices.',
    180,
    'tea',
    true,
    false,
    false,
    true,
    '/images/menu/masala-chai.jpg',
  ],
  [
    'lemon-ginger-tea',
    'Lemon Ginger Tea',
    'Ginger tea with lemon and a little honey.',
    200,
    'tea',
    true,
    false,
    false,
    true,
    '/images/menu/lemon-ginger-tea.jpg',
  ],
  [
    'avocado-toast',
    'Avocado Toast',
    'Sourdough toast with avocado, lemon, and herbs.',
    480,
    'breakfast',
    true,
    true,
    false,
    false,
    '/images/menu/avocado-toast.jpg',
  ],
  [
    'luna-breakfast',
    'Luna Breakfast Plate',
    'Eggs, grilled tomato, mushrooms, and toast.',
    620,
    'breakfast',
    false,
    true,
    false,
    false,
    '/images/menu/luna-breakfast.jpg',
  ],
  [
    'sel-roti',
    'Sel Roti & Aloo Achar',
    'Traditional rice-flour ring bread with potato pickle.',
    320,
    'snacks',
    true,
    true,
    false,
    false,
    '/images/menu/sel-roti.jpg',
  ],
  [
    'veg-momo',
    'Steamed Vegetable Momo',
    'Vegetable dumplings served with tomato achar.',
    380,
    'snacks',
    true,
    true,
    false,
    false,
    '/images/menu/vegetable-momo.jpg',
  ],
  [
    'mushroom-risotto',
    'Mushroom Rice Bowl',
    'Creamy local mushroom rice with herbs.',
    680,
    'main-meals',
    true,
    true,
    false,
    false,
    '/images/menu/mushroom-rice-bowl.jpg',
  ],
  [
    'chicken-thali',
    'Chicken Thali',
    'Chicken curry with rice, seasonal vegetables, and achar.',
    780,
    'main-meals',
    false,
    false,
    false,
    true,
    '/images/menu/chicken-thali.jpg',
  ],
  [
    'lemon-tart',
    'Lemon Tart',
    'Buttery tart shell with bright lemon filling.',
    320,
    'desserts',
    true,
    false,
    false,
    false,
    '/images/menu/lemon-tart.jpg',
  ],
  [
    'cold-brew',
    'Cold Brew',
    'Slow-steeped coffee served over ice.',
    300,
    'cold-drinks',
    true,
    true,
    true,
    true,
    '/images/menu/cold-brew.jpg',
  ],
  [
    'mango-lassi',
    'Mango Lassi',
    'Yogurt blended with mango and a touch of cardamom.',
    350,
    'cold-drinks',
    true,
    false,
    false,
    false,
    '/images/menu/mango-lassi.jpg',
  ],
];

const galleryImages = [
  {
    id: 'demo-lakeside-cafe',
    title: 'Lakeside café coffee concept',
    imageUrl: '/images/menu/flat-white.jpg',
    altText: 'A flat white served alongside a small café treat',
    category: 'Drinks',
    visible: false,
    sortOrder: 0,
  },
  {
    id: 'gallery-espresso',
    title: 'Coffee, freshly prepared',
    imageUrl: '/images/menu/luna-signature-espresso.jpg',
    altText: 'Freshly prepared espresso in a small cup',
    category: 'Drinks',
    sortOrder: 1,
  },
  {
    id: 'gallery-flat-white',
    title: 'A quiet coffee break',
    imageUrl: '/images/menu/flat-white.jpg',
    altText: 'A flat white served alongside a small café treat',
    category: 'Drinks',
    sortOrder: 2,
  },
  {
    id: 'gallery-breakfast',
    title: 'Breakfast at the café',
    imageUrl: '/images/menu/luna-breakfast.jpg',
    altText: 'A breakfast plate with egg and fresh accompaniments',
    category: 'Food',
    sortOrder: 3,
  },
  {
    id: 'gallery-avocado-toast',
    title: 'Avocado toast',
    imageUrl: '/images/menu/avocado-toast.jpg',
    altText: 'Avocado toast with lemon and herbs',
    category: 'Food',
    sortOrder: 4,
  },
  {
    id: 'gallery-momo',
    title: 'Steamed vegetable momo',
    imageUrl: '/images/menu/vegetable-momo.jpg',
    altText: 'Steamed vegetable momo served with tomato achar',
    category: 'Food',
    sortOrder: 5,
  },
  {
    id: 'gallery-sel-roti',
    title: 'A taste of Nepal',
    imageUrl: '/images/menu/sel-roti.jpg',
    altText: 'Traditional Nepali sel roti',
    category: 'Food',
    sortOrder: 6,
  },
  {
    id: 'gallery-lemon-tart',
    title: 'Lemon tart',
    imageUrl: '/images/menu/lemon-tart.jpg',
    altText: 'Lemon tart with a golden pastry crust',
    category: 'Desserts',
    sortOrder: 7,
  },
  {
    id: 'gallery-cold-brew',
    title: 'Cold brew over ice',
    imageUrl: '/images/menu/cold-brew.jpg',
    altText: 'Cold brew coffee served over ice',
    category: 'Drinks',
    sortOrder: 8,
  },
];

async function main() {
  const categoryIds = new Map();
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder, active: true },
      create: category,
    });
    categoryIds.set(category.slug, saved.id);
  }

  for (const [
    slug,
    name,
    description,
    price,
    categorySlug,
    vegetarian,
    featured,
    vegan,
    available,
    image,
  ] of items) {
    await prisma.menuItem.upsert({
      where: { slug },
      update: {
        name,
        description,
        price,
        categoryId: categoryIds.get(categorySlug),
        vegetarian,
        featured,
        vegan,
        available,
        image,
        imageAlt: `${name}, served at Luna Brew Café`,
      },
      create: {
        slug,
        name,
        description,
        price,
        categoryId: categoryIds.get(categorySlug),
        vegetarian,
        featured,
        vegan,
        available,
        image,
        imageAlt: `${name}, served at Luna Brew Café`,
      },
    });
  }

  for (const image of galleryImages) {
    await prisma.galleryImage.upsert({
      where: { id: image.id },
      update: image,
      create: image,
    });
  }

  await prisma.businessSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'Luna Brew Café',
      locationLabel: 'Lakeside, Pokhara, Nepal',
      openingHours: {
        weekdays: '7:30 AM – 8:00 PM',
        saturday: '8:00 AM – 9:00 PM',
        sunday: '8:00 AM – 7:00 PM',
      },
    },
  });

  console.log('Luna Brew Café menu, gallery seed records, and settings are ready.');
}

main()
  .catch((error) => {
    console.error('Prisma seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
