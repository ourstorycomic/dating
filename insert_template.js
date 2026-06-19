const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.template.create({
    data: {
      id: 'tpl_valentine_2_watchparty',
      slug: 'valentine-2',
      name: 'Rạp Phim Của Hai Ta (Watch Party)',
      description: 'Hành trình kỷ niệm từ nhập mật khẩu mở khóa, xem album polaroid, thư tay, cho đến màn rạp phim xem chung (đồng bộ Real-time Play/Pause) xịn sò!',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
      previewUrl: '/templates/valentine-2/preview',
      componentKey: 'valentine-2',
      basePrice: 199000,
      isPublished: true,
      sortOrder: 4
    }
  });
  console.log('Inserted:', result);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
