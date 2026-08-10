import { prisma } from "../src/lib/prisma";

async function main() {
  const total = await prisma.variant.count();
  const published = await prisma.variant.count({ where: { publicationStatus: "PUBLISHED" } });
  const samples = await prisma.variant.findMany({
    select: { id: true, name: true, slug: true, publicationStatus: true, isFeatured: true, isPopular: true },
    take: 10,
  });

  console.log({ total, published });
  console.log(samples);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
