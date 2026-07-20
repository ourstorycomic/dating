import { Metadata } from "next";
import { getTemplateBySlug } from "@/lib/supabase/server";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = await getTemplateBySlug(id);

  if (!template) {
    return { title: "Không tìm thấy mẫu | Lovora" };
  }

  const title = `Mẫu thiệp cưới ${template.name} | Lovora`;
  const description = template.description || "Xem trước mẫu thiệp cưới siêu đẹp và sang trọng trên Lovora.";
  const thumbnail = template.thumbnail_url || "/thumbnails/valentine1.png";
  const imageUrl = thumbnail.startsWith('http') ? thumbnail : `https://lovora.vn${thumbnail}`;
  const images = [{ url: imageUrl, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
  return children;
}
