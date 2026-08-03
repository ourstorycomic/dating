require('dotenv').config();

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // First fetch category
  const resCat = await fetch(`${url}/rest/v1/template_categories?slug=eq.wedding&select=id`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  const catData = await resCat.json();
  const categoryId = catData[0].id;

  const newTemplate = {
    category_id: categoryId,
    slug: 'videowedding-1',
    name: 'Story of Us',
    description: 'Mẫu video ngày cưới kể lại câu chuyện tình yêu của hai người với những khung hình lãng mạn, hiệu ứng mượt mà và âm nhạc cảm xúc. Độ phân giải 4K sắc nét.',
    tagline: 'Video 4K',
    component_key: 'videowedding-1',
    visual_label: 'HOT',
    gradient: 'from-pink-400 to-rose-500',
    base_price: 239000,
    data_schema: [
      { section: "2. Chỉnh sửa Video", key: "text1", label: "Tiêu đề Scene 1", type: "text", default: "Our Journey" },
      { section: "2. Chỉnh sửa Video", key: "text2", label: "Nội dung Scene 1", type: "text", default: "Bắt đầu từ những điều giản đơn nhất..." },
      { section: "2. Chỉnh sửa Video", key: "text3", label: "Tiêu đề Scene 2", type: "text", default: "Forever Yours" },
      { section: "2. Chỉnh sửa Video", key: "text4", label: "Nội dung Scene 2", type: "text", default: "Cùng nhau đi qua mọi thăng trầm của cuộc sống." }
    ],
    sample_data: {
      text1: "Our Journey",
      text2: "Bắt đầu từ những điều giản đơn nhất...",
      text3: "Forever Yours",
      text4: "Cùng nhau đi qua mọi thăng trầm của cuộc sống."
    },
    status_label: 'published',
    sort_order: 10,
    thumbnail_url: '/assets/videowedding-1/slide-mau/1.png',
    is_published: true
  };

  const res = await fetch(`${url}/rest/v1/templates`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(newTemplate)
  });

  const data = await res.json();
  console.log("Response:", data);
}

main();
