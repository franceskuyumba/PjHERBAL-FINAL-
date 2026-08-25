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
async function main(){
  const cats = await prisma.category.findMany();
  console.log('Categories:', cats.length);
  for(const c of cats){
    const photo = photos[Math.floor(Math.random()*photos.length)];
    await prisma.category.update({ where:{id:c.id}, data:{image: photo}});
    console.log(c.name + ' -> ' + photo);
  }
}
main().then(()=>prisma.$disconnect());
