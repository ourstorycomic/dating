const fs = require('fs');
const file = 'd:/dating/lib/supabase/server.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `    template_categories: { slug: "wedding", name: "Wedding", description: null }
  }))
];`;

const replacement = `    template_categories: { slug: "wedding", name: "Wedding", description: null }
  })),
  {
    id: "videowedding-1-mock",
    slug: "videowedding-1",
    name: "Story of Us",
    component_key: "videowedding-1",
    description: "Mẫu video ngày cưới kể lại câu chuyện tình yêu của hai người với những khung hình lãng mạn, hiệu ứng mượt mà và âm nhạc cảm xúc. Độ phân giải 4K sắc nét.",
    tagline: "Lãng mạn",
    base_price: 209000,
    visual_label: "HOT",
    gradient: "from-gray-100 to-gray-400",
    status_label: "Mới",
    sort_order: 31,
    thumbnail_url: "/assets/videowedding-1/anhchung2.jpg",
    data_schema: [],
    sample_data: {},
    template_categories: { slug: "wedding", name: "Wedding", description: null }
  },
  {
    id: "videowedding-2-mock",
    slug: "videowedding-2",
    name: "Cinema Luxury",
    component_key: "videowedding-2",
    description: "Mẫu video trình chiếu tiệc cưới phong cách rạp chiếu phim (Cinematic). Sang trọng, tinh tế với hiệu ứng ánh sáng, màu sắc điện ảnh và những châm ngôn tình yêu cảm động. Độ phân giải 4K sắc nét.",
    tagline: "Sang Trọng",
    base_price: 259000,
    visual_label: "NEW",
    gradient: "from-[#C69C6D] to-[#0f0407]",
    status_label: "Mới",
    sort_order: 32,
    thumbnail_url: "/assets/videowedding-2/anhchung12.jpg",
    data_schema: [],
    sample_data: {},
    template_categories: { slug: "wedding", name: "Wedding", description: null }
  }
];`;

if (content.includes("slug: \"wedding\", name: \"Wedding\"")) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success");
} else {
    console.log("Target not found");
}
