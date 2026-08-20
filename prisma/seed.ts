import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "mens-health",
    name: "Men's Health",
    description: "Support vitality, stamina and prostate wellbeing.",
    icon: "shield",
    image: "/images/categories/mens-health.svg",
    sortOrder: 1,
  },
  {
    slug: "weight-management",
    name: "Weight Management",
    description: "Natural support for healthy weight loss journeys.",
    icon: "scale",
    image: "/images/categories/weight-management.svg",
    sortOrder: 2,
  },
  {
    slug: "energy-immunity",
    name: "Energy & Immunity",
    description: "Daily power, stronger defenses and all-round vitality.",
    icon: "zap",
    image: "/images/categories/energy-immunity.svg",
    sortOrder: 3,
  },
  {
    slug: "womens-wellness",
    name: "Women's Wellness",
    description: "Nourishment and balance for every stage of life.",
    icon: "flower",
    image: "/images/categories/womens-wellness.svg",
    sortOrder: 4,
  },
  {
    slug: "brain-focus",
    name: "Brain & Focus",
    description: "Sharper memory, clearer thinking and mental energy.",
    icon: "brain",
    image: "/images/categories/brain-focus.svg",
    sortOrder: 5,
  },
  {
    slug: "detox-digestion",
    name: "Detox & Digestion",
    description: "Gentle cleansing and happy, healthy digestion.",
    icon: "leaf",
    image: "/images/categories/detox-digestion.svg",
    sortOrder: 6,
  },
];

const products = [
  // Men's Health
  {
    slug: "male-vitality-plus",
    name: "Male Vitality Plus",
    shortDescription: "Herbal formula for strength, stamina and confidence.",
    description:
      "Male Vitality Plus is a carefully blended herbal formulation designed to support men's natural vitality. It combines traditional East African botanicals with modern nutritional science to help you feel strong, focused and energized.",
    ingredients: "Tongkat Ali extract, Maca root, Tribulus terrestris, Ginger, Zinc, Vitamin B6",
    usage: "Take 2 capsules daily with a meal. Drink plenty of water.",
    benefits: "Supports stamina and physical energy, promotes healthy testosterone balance, supports muscle strength and recovery.",
    precautions: "Not for use under 18. Consult your doctor if you are on medication or have a medical condition.",
    price: 45000,
    compareAtPrice: 55000,
    stock: 34,
    status: "ACTIVE",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    ratingCount: 42,
    categorySlug: "mens-health",
  },
  {
    slug: "vigor-max-capsules",
    name: "VigorMax Capsules",
    shortDescription: "Daily vitality capsules for men on the go.",
    description:
      "VigorMax Capsules deliver a concentrated blend of natural herbs to keep you performing at your best all day long — at work, at home and in the gym.",
    ingredients: "Ginseng extract, Ashwagandha, Saw palmetto, Vitamin D3, Magnesium",
    usage: "Take 1 capsule after breakfast. Do not exceed the recommended dose.",
    benefits: "Boosts daily energy, supports mental focus, aids muscle recovery.",
    precautions: "Keep away from children. Consult a health professional if pregnant, nursing or on medication.",
    price: 38000,
    stock: 21,
    status: "ACTIVE",
    isBestSeller: true,
    rating: 4.6,
    ratingCount: 28,
    categorySlug: "mens-health",
  },
  {
    slug: "prostacare",
    name: "ProstaCare",
    shortDescription: "Herbal support for a healthy prostate.",
    description:
      "ProstaCare is formulated to support prostate health and urinary comfort in men, using time-honored herbal ingredients known for their protective properties.",
    ingredients: "Saw palmetto, Pumpkin seed extract, Nettle root, Pygeum",
    usage: "Take 2 capsules daily with food.",
    benefits: "Supports prostate health, promotes urinary comfort, gentle herbal formula.",
    precautions: "Consult your doctor before use, especially if you are being treated for a prostate condition.",
    price: 52000,
    stock: 15,
    status: "ACTIVE",
    rating: 4.5,
    ratingCount: 17,
    categorySlug: "mens-health",
  },

  // Weight Management
  {
    slug: "slimherbal-tea",
    name: "SlimHerbal Tea",
    shortDescription: "Refreshing detox tea that supports weight loss.",
    description:
      "SlimHerbal Tea combines green tea, hibiscus and traditional detox herbs into a delicious daily brew that supports metabolism and helps you feel lighter.",
    ingredients: "Green tea, Hibiscus, Ginger, Senna leaf, Lemongrass",
    usage: "Steep one tea bag in hot water for 3-5 minutes. Drink 1-2 cups daily.",
    benefits: "Supports metabolism, gentle natural detox, refreshing and delicious.",
    precautions: "Not recommended during pregnancy or breastfeeding.",
    price: 18000,
    stock: 60,
    status: "ACTIVE",
    isBestSeller: true,
    rating: 4.7,
    ratingCount: 55,
    categorySlug: "weight-management",
  },
  {
    slug: "fat-burn-max",
    name: "Fat Burn Max",
    shortDescription: "Thermogenic blend to accelerate fat burning.",
    description:
      "Fat Burn Max is a thermogenic herbal blend designed to support healthy weight management when combined with a balanced diet and exercise.",
    ingredients: "Green coffee extract, Garcinia cambogia, Green tea extract, Cayenne, L-Carnitine",
    usage: "Take 2 capsules 30 minutes before meals.",
    benefits: "Supports fat metabolism, curbs cravings, boosts natural energy.",
    precautions: "Contains caffeine. Avoid in the evening. Consult your doctor if you have heart conditions.",
    price: 42000,
    compareAtPrice: 50000,
    stock: 26,
    status: "ACTIVE",
    rating: 4.4,
    ratingCount: 31,
    categorySlug: "weight-management",
  },
  {
    slug: "garcinia-cambogia",
    name: "Garcinia Cambogia Extract",
    shortDescription: "Traditional appetite support from the tropics.",
    description:
      "Pure Garcinia Cambogia extract with natural hydroxycitric acid (HCA), traditionally used to support appetite control and weight management.",
    ingredients: "Garcinia Cambogia extract (60% HCA)",
    usage: "Take 2 capsules twice daily before meals.",
    benefits: "Supports appetite control, helps manage carbohydrate absorption.",
    precautions: "Consult a doctor before use if you have diabetes or take medication.",
    price: 36000,
    stock: 19,
    status: "ACTIVE",
    rating: 4.3,
    ratingCount: 12,
    categorySlug: "weight-management",
  },

  // Energy & Immunity
  {
    slug: "moringa-power",
    name: "Moringa Power Capsules",
    shortDescription: "Nature's multivitamin in every capsule.",
    description:
      "Moringa oleifera leaves are packed with vitamins, minerals and antioxidants. Moringa Power delivers a daily dose of nature's most nutrient-dense superfood.",
    ingredients: "100% pure organic Moringa oleifera leaf powder",
    usage: "Take 2 capsules daily with water, ideally with a meal.",
    benefits: "Rich in vitamins A, C and E, supports natural immunity, boosts daily energy.",
    precautions: "Consult your doctor if pregnant, breastfeeding or on thyroid medication.",
    price: 25000,
    stock: 80,
    status: "ACTIVE",
    isBestSeller: true,
    rating: 4.9,
    ratingCount: 67,
    categorySlug: "energy-immunity",
  },
  {
    slug: "black-seed-oil",
    name: "Black Seed Oil Capsules",
    shortDescription: "The ancient seed of blessing for immunity.",
    description:
      "Cold-pressed Nigella sativa (black seed) oil in convenient capsules, traditionally treasured for supporting immunity, breathing and overall wellness.",
    ingredients: "Cold-pressed black seed oil (Nigella sativa)",
    usage: "Take 1-2 capsules daily with a meal.",
    benefits: "Supports immune function, supports respiratory comfort, rich in antioxidants.",
    precautions: "Consult your doctor if pregnant or on blood-thinning medication.",
    price: 48000,
    stock: 33,
    status: "ACTIVE",
    isBestSeller: true,
    rating: 4.8,
    ratingCount: 39,
    categorySlug: "energy-immunity",
  },
  {
    slug: "ginger-honey-tonic",
    name: "Ginger & Honey Tonic",
    shortDescription: "Soothing traditional wellness tonic.",
    description:
      "A warming blend of fresh ginger and pure honey, crafted to support throat comfort and daily vitality — a beloved Tanzanian home remedy in bottle form.",
    ingredients: "Fresh ginger extract, pure honey, lemon, vitamin C",
    usage: "Take 2 tablespoons daily, or add to warm water or tea.",
    benefits: "Soothes the throat, supports digestion, natural energy lift.",
    precautions: "Not for infants under 1 year. Contains honey.",
    price: 22000,
    stock: 45,
    status: "ACTIVE",
    rating: 4.6,
    ratingCount: 24,
    categorySlug: "energy-immunity",
  },
  {
    slug: "bee-propolis",
    name: "Bee Propolis 500mg",
    shortDescription: "Pure propolis for natural defense.",
    description:
      "Propolis is a resinous mixture produced by honeybees, rich in flavonoids. Our Bee Propolis capsules support your body's natural defenses.",
    ingredients: "Bee propolis extract 500mg",
    usage: "Take 1 capsule daily.",
    benefits: "Supports natural immunity, rich in antioxidants, supports oral health.",
    precautions: "Avoid if allergic to bee products.",
    price: 30000,
    compareAtPrice: 35000,
    stock: 28,
    status: "ACTIVE",
    rating: 4.5,
    ratingCount: 15,
    categorySlug: "energy-immunity",
  },

  // Women's Wellness
  {
    slug: "womens-balance",
    name: "Women's Balance",
    shortDescription: "Gentle hormonal and cycle support.",
    description:
      "Women's Balance blends herbs traditionally used to support hormonal harmony, monthly comfort and emotional wellbeing.",
    ingredients: "Chasteberry (Vitex), Dong quai, Evening primrose oil, B6, Magnesium",
    usage: "Take 2 capsules daily with food.",
    benefits: "Supports hormonal balance, promotes monthly comfort, calms mood.",
    precautions: "Consult your doctor if pregnant, nursing or on hormonal medication.",
    price: 46000,
    compareAtPrice: 54000,
    stock: 23,
    status: "ACTIVE",
    isBestSeller: true,
    rating: 4.7,
    ratingCount: 36,
    categorySlug: "womens-wellness",
  },
  {
    slug: "collagen-glow",
    name: "Collagen Glow",
    shortDescription: "Beauty from within for skin, hair and nails.",
    description:
      "Collagen Glow delivers premium hydrolyzed collagen plus vitamin C to support firm, glowing skin and strong hair and nails.",
    ingredients: "Hydrolyzed collagen peptides, Vitamin C, Biotin, Zinc",
    usage: "Mix 1 scoop with water or juice daily.",
    benefits: "Supports skin elasticity, strengthens hair and nails, hydrating glow.",
    precautions: "Not a substitute for a varied diet.",
    price: 68000,
    compareAtPrice: 80000,
    stock: 18,
    status: "ACTIVE",
    rating: 4.6,
    ratingCount: 29,
    categorySlug: "womens-wellness",
  },
  {
    slug: "femcare",
    name: "FemCare Herbal Capsules",
    shortDescription: "Daily nourishment for women.",
    description:
      "FemCare combines iron-rich herbs and essential nutrients to support women's daily energy, especially during heavy days.",
    ingredients: "Ashwagandha, Shatavari, Iron, Folic acid, Vitamin C",
    usage: "Take 2 capsules daily after meals.",
    benefits: "Supports healthy iron levels, reduces fatigue, supports overall wellness.",
    precautions: "Keep out of reach of children.",
    price: 34000,
    stock: 27,
    status: "ACTIVE",
    rating: 4.4,
    ratingCount: 14,
    categorySlug: "womens-wellness",
  },

  // Brain & Focus
  {
    slug: "brain-booster",
    name: "Brain Booster",
    shortDescription: "Sharp focus and a memory you can rely on.",
    description:
      "Brain Booster is a nootropic herbal blend designed to enhance memory, concentration and mental clarity for students and professionals.",
    ingredients: "Ginkgo biloba, Bacopa monnieri, Lion's mane mushroom, Omega-3, B12",
    usage: "Take 2 capsules daily with breakfast.",
    benefits: "Supports memory and recall, enhances focus, nourishes brain cells.",
    precautions: "Consult your doctor if on blood-thinning medication.",
    price: 55000,
    compareAtPrice: 65000,
    stock: 22,
    status: "ACTIVE",
    isBestSeller: true,
    rating: 4.7,
    ratingCount: 33,
    categorySlug: "brain-focus",
  },
  {
    slug: "focus-formula",
    name: "Focus Formula",
    shortDescription: "Stay locked-in from morning to evening.",
    description:
      "Focus Formula delivers steady mental energy without the crash, helping you stay productive through long working days.",
    ingredients: "Rhodiola rosea, L-Theanine, Green tea extract, B-complex",
    usage: "Take 1 capsule in the morning and 1 at midday.",
    benefits: "Sustained mental energy, reduces mental fatigue, calm alertness.",
    precautions: "Contains green tea caffeine. Avoid late evening use.",
    price: 41000,
    stock: 30,
    status: "ACTIVE",
    rating: 4.5,
    ratingCount: 19,
    categorySlug: "brain-focus",
  },

  // Detox & Digestion
  {
    slug: "detox-cleanse",
    name: "Detox Cleanse",
    shortDescription: "Gentle 14-day whole body cleanse.",
    description:
      "Detox Cleanse is a gentle herbal program designed to support your body's natural detoxification pathways and leave you feeling lighter.",
    ingredients: "Milk thistle, Dandelion root, Artichoke, Psyllium husk, Turmeric",
    usage: "Take 3 capsules daily with plenty of water. Best used as a 14-day program.",
    benefits: "Supports liver function, gentle colon cleanse, reduces bloating.",
    precautions: "Not for use during pregnancy. Consult a doctor if on medication.",
    price: 49000,
    stock: 16,
    status: "ACTIVE",
    rating: 4.6,
    ratingCount: 21,
    categorySlug: "detox-digestion",
  },
  {
    slug: "digestease",
    name: "DigestEase",
    shortDescription: "Soothing relief for indigestion and bloating.",
    description:
      "DigestEase combines digestive enzymes with soothing herbal extracts to support comfortable digestion after every meal.",
    ingredients: "Papaya extract, Ginger, Peppermint, Fennel, Digestive enzymes",
    usage: "Take 1-2 capsules after meals.",
    benefits: "Reduces bloating and gas, supports nutrient absorption, calms the stomach.",
    precautions: "Consult a doctor if symptoms persist.",
    price: 32000,
    stock: 38,
    status: "ACTIVE",
    rating: 4.5,
    ratingCount: 26,
    categorySlug: "detox-digestion",
  },
  {
    slug: "aloe-detox-juice",
    name: "Aloe Detox Juice",
    shortDescription: "Pure aloe vera for inner cleansing.",
    description:
      "Cold-pressed aloe vera juice to support digestion, hydration and a healthy gut — refreshing and easy to drink daily.",
    ingredients: "Certified organic aloe vera inner fillet juice",
    usage: "Drink 50ml in the morning on an empty stomach.",
    benefits: "Supports gut health, gentle natural cleanse, hydrating.",
    precautions: "Not recommended during pregnancy or for those with IBS without medical advice.",
    price: 20000,
    stock: 41,
    status: "ACTIVE",
    rating: 4.3,
    ratingCount: 11,
    categorySlug: "detox-digestion",
  },
];

const blogPosts = [
  {
    slug: "natural-immunity-boosters-2026",
    title: "5 Natural Immunity Boosters Every Tanzanian Should Know",
    excerpt:
      "From moringa to black seed oil, discover the traditional superfoods that keep Tanzanian families strong.",
    content: [
      "## The power of nature",
      "For generations, Tanzanian families have turned to nature for strength and healing. Modern life demands more from our immune systems than ever before, and the good news is that the answers often grow right in our own soil.",
      "",
      "### 1. Moringa",
      "Known as the 'miracle tree', moringa leaves contain more vitamin C than oranges, more calcium than milk and more iron than spinach. It is the ultimate daily multivitamin.",
      "",
      "### 2. Black seed oil",
      "Nigella sativa has been treasured for centuries for its ability to support immune function and respiratory comfort.",
      "",
      "### 3. Ginger and honey",
      "A warm cup of ginger and honey tea is more than comforting — it is a scientifically supported way to soothe the throat and support defenses.",
      "",
      "### 4. Bee propolis",
      "Bees create propolis to protect their hives, and the same compounds can support your body's natural defenses.",
      "",
      "### 5. A balanced lifestyle",
      "No supplement replaces sleep, water and movement. Combine these natural allies with good habits for the strongest defense.",
    ].join("\n"),
    category: "Immunity",
    author: "Dr. P. John",
    authorRole: "Lead Naturopath, PJHERBAL Clinic",
    coverImage: "/images/blog/immunity.svg",
    readingTime: 4,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2026-08-01T06:00:00.000Z"),
  },
  {
    slug: "healthy-weight-loss-tanzania",
    title: "Healthy Weight Loss: A Practical Guide for Tanzanians",
    excerpt:
      "Sustainable weight loss is about small daily choices. Here is how natural supplements can support the journey.",
    content: [
      "## Weight loss is a journey, not a race",
      "Every body is different, and the quickest fix is rarely the healthiest one. Sustainable weight management combines balanced eating, movement and the right natural support.",
      "",
      "### The role of herbal support",
      "Ingredients like green coffee extract and garcinia cambogia can support metabolism and appetite control — but they work best alongside real lifestyle change.",
      "",
      "### Start your morning with green tea",
      "Swapping sugary drinks for natural tea is one of the simplest changes you can make. Our SlimHerbal Tea makes it delicious.",
      "",
      "### Move every day",
      "You do not need a gym. Walking, dancing and physical work all count. Consistency beats intensity.",
      "",
      "### Be patient with yourself",
      "Celebrate small wins. Long-term health is built one day at a time.",
    ].join("\n"),
    category: "Wellness",
    author: "N. Hassan",
    authorRole: "Nutrition Advisor, PJHERBAL Clinic",
    coverImage: "/images/blog/weight.svg",
    readingTime: 5,
  },
  {
    slug: "mens-vitality-after-40",
    title: "Men's Vitality After 40: What Actually Works",
    excerpt:
      "Energy, focus and strength don't have to fade. Here's how natural herbs can support men's health at every age.",
    content: [
      "## Vitality is not just for the young",
      "Many men notice changes in energy, focus and stamina after 40. The good news: natural herbal support can make a real difference.",
      "",
      "### Understand your body's needs",
      "Testosterone naturally declines with age. Herbs like tongkat ali and maca root have been traditionally used to support healthy levels.",
      "",
      "### Prioritize recovery",
      "Sleep is when your body repairs. Aim for 7-8 hours and let your muscles actually recover.",
      "",
      "### Strength training matters",
      "Lifting weights supports more than muscle — it supports hormones, bone density and confidence.",
      "",
      "### Herbs that help",
      "Male Vitality Plus combines the most-studied botanicals for men's health in one simple daily capsule.",
    ].join("\n"),
    category: "Men's Health",
    author: "Dr. P. John",
    authorRole: "Lead Naturopath, PJHERBAL Clinic",
    coverImage: "/images/blog/mens-health.svg",
    readingTime: 4,
  },
  {
    slug: "detox-myths-facts",
    title: "Detox: Myths, Facts and What Your Body Actually Needs",
    excerpt:
      "Detoxing is surrounded by hype. Learn what actually supports your body's natural cleansing systems.",
    content: [
      "## Your body already knows how to detox",
      "The liver, kidneys and skin work around the clock to remove waste. A 'detox' is really about giving these systems the support they need.",
      "",
      "### Drink more water",
      "Hydration is the simplest detox there is. Start each day with a large glass of water.",
      "",
      "### Eat whole foods",
      "Fiber-rich vegetables, fruits and whole grains help your digestion run smoothly.",
      "",
      "### Herbal support",
      "Milk thistle, dandelion and artichoke have a long history of supporting liver health. Our Detox Cleanse combines them thoughtfully.",
      "",
      "### Avoid extremes",
      "Very low-calorie diets and harsh laxatives do more harm than good. Gentle, consistent support wins.",
    ].join("\n"),
    category: "Detox",
    author: "N. Hassan",
    authorRole: "Nutrition Advisor, PJHERBAL Clinic",
    coverImage: "/images/blog/detox.svg",
    readingTime: 5,
  },
];

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@pjherbal.co.tz";
  const seedPassword = process.env.SEED_ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "Admin@12345");
  if (!seedPassword || seedPassword.length < 12) {
    throw new Error("Set SEED_ADMIN_PASSWORD to a strong password before production seeding.");
  }
  const adminPassword = await bcrypt.hash(seedPassword, 10);
  const customerPassword = await bcrypt.hash("Customer@123", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "PJHERBAL Admin",
      email: adminEmail,
      phone: "255700000001",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      phone: "255700000002",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });

  const categoryRecords = new Map();
  for (const c of categories) {
    const record = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    categoryRecords.set(c.slug, record);
  }

  for (const p of products) {
    const { categorySlug, ...data } = p;
    const category = categoryRecords.get(categorySlug);
    if (!category) continue;
    const image = `/images/products/${p.slug}.svg`;
    const sku = `PJH-${p.slug.replace(/-/g, "").toUpperCase().slice(0, 10)}`;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, sku, categoryId: category.id, images: image },
      create: { ...data, sku, categoryId: category.id, images: image },
    });
  }

  const couponData = [
    { code: "WELCOME10", type: "PERCENTAGE", value: 10, minOrder: 30000, maxDiscount: 20000, maxUses: 500, expiresAt: new Date("2027-12-31") },
    { code: "FREE15K", type: "FIXED", value: 15000, minOrder: 100000, maxUses: 200, expiresAt: new Date("2026-12-31") },
  ];
  for (const c of couponData) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  const reviews = [
    { slug: "male-vitality-plus", rating: 5, author: "Juma M.", title: "Felt the difference in weeks", comment: "Energy levels are back up and I feel stronger at work. Highly recommended." },
    { slug: "male-vitality-plus", rating: 4, author: "Emmanuel K.", comment: "Good product, consistent energy throughout the day." },
    { slug: "moringa-power", rating: 5, author: "Amina S.", title: "My daily multivitamin", comment: "Simple, natural and I feel great. The whole family takes it." },
    { slug: "moringa-power", rating: 5, author: "Peter L.", comment: "Delivered fast in Dar es Salaam. Quality is excellent." },
    { slug: "slimherbal-tea", rating: 4, author: "Grace T.", title: "Love the taste", comment: "3 weeks in and my bloating is gone. Tastes lovely too." },
    { slug: "black-seed-oil", rating: 5, author: "Salim O.", comment: "My seasonal allergies feel much better. Great quality." },
  ];

  for (const r of reviews) {
    const product = await prisma.product.findUnique({ where: { slug: r.slug } });
    if (!product) continue;
    const author = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: author?.id ?? null,
        author: r.author,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isApproved: true,
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
