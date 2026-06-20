require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function seed() {
  const response = await fetch(`${supabaseUrl}/rest/v1/templates`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      slug: 'valentine-3',
      name: 'Valentine #3',
      description: 'Nhật Ký Tình Yêu Toàn Tập (The Ultimate Pink Diary)',
      category_id: '10fc38bd-03d3-4739-b9f6-c786204838b4',
      base_price: 99000,
      is_published: true,
      component_key: 'valentine-3',
      visual_label: 'Valentine Diary',
      tagline: 'Gửi trọn kỷ niệm',
      data_schema: {
        type: "object",
        properties: {
          startDate: { type: "string" },
          musicUrl: { type: "string" },
          quiz: { type: "array" },
          puzzleImage: { type: "string" },
          fakeChat: { type: "array" },
          photos: { type: "array" },
          letterTitle: { type: "string" },
          letterContent: { type: "string" }
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error inserting template:", errorText);
  } else {
    const data = await response.json();
    console.log("Template inserted successfully:", data);
  }
}

seed();
