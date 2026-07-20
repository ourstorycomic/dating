import { Metadata } from "next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getOrderByPublicId } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  
  // Try to fetch template from DB
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
  
  const { data: template } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", id)
    .single();

  let title = "Mẫu Thiệp Cưới Sang Trọng | Lovora";
  let description = "Khám phá các mẫu thiệp cưới điện tử tinh tế, hiện đại. Tùy chỉnh dễ dàng và gửi đến người thân yêu.";
  let thumbnail = "/thumbnails/valentine1.png";

  if (template) {
    title = `${template.name} - Mẫu Thiệp Cưới | Lovora`;
    description = template.description || description;
    thumbnail = template.thumbnail_url || thumbnail;
  } else {
    // Maybe it's an order ID?
    const order = await getOrderByPublicId(id);
    if (order && order.templates) {
      title = `Thiệp Cưới Của ${order.buyer_name || "Chúng Mình"} | Lovora`;
      thumbnail = order.templates.thumbnail_url || thumbnail;
    }
  }

  const imageUrl = thumbnail.startsWith('http') ? thumbnail : `https://lovora.click${thumbnail}`;
  const images = [{ url: imageUrl, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://lovora.click/wedding/preview/${id}`,
      siteName: "Lovora Wedding",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
