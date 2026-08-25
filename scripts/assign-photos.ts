import { prisma } from "../src/lib/prisma";

const photos = [
  "/uploads/saved/pjherbal-01.jpeg",
  "/uploads/saved/pjherbal-02.jpeg",
  "/uploads/saved/pjherbal-03.jpeg",
  "/uploads/saved/pjherbal-04.jpeg",
  "/uploads/saved/wellness-01.jpeg",
  "/uploads/saved/wellness-02.jpeg",
  "/uploads/saved/wellness-03.jpeg",
  "/uploads/saved/wellness-04.jpeg",
  "/uploads/saved/wellness-05.jpeg",
];

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, images: true } });
  console.log(`Found ${products.length} products`);
  for (const p of products) {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    // Keep existing image if it's already an uploaded photo, otherwise assign random
    // For this request: assign random to ALL products to ensure all have photos
    await prisma.product.update({
      where: { id: p.id },
      data: { images: randomPhoto },
    });
    console.log(`Updated ${p.name} -> ${randomPhoto}`);
  }
  console.log("Done - all products now have photos from your uploads");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
