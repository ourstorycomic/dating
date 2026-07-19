export const revalidate = 0;
export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getTemplateBySlug, getPublishedTemplates } from "@/lib/supabase/server";
import { PreviewClient } from "@/components/templates/PreviewClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    return { title: "Không tìm thấy mẫu | Lovora" };
  }

  const title = `Mẫu ${template.name} | Lovora`;
  const description = template.description || "Xem trước mẫu giao diện quà tặng tuyệt đẹp trên Lovora.";
  const images = [template.thumbnail_url || "/thumbnails/valentine1.png"];

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

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    return <div className="text-white p-20 text-5xl flex h-screen items-center justify-center">Template không tồn tại ({slug})</div>;
  }

  // Lấy các template cùng category
  const allTemplates = await getPublishedTemplates();
  const categorySlug = template.template_categories?.slug;
  let relatedTemplates = allTemplates
    .filter(t => t.template_categories?.slug === categorySlug && t.slug !== template.slug);

  if (relatedTemplates.length < 4) {
    const otherTemplates = allTemplates.filter(t => t.template_categories?.slug !== categorySlug && t.slug !== template.slug);
    relatedTemplates = [...relatedTemplates, ...otherTemplates];
  }
  
  relatedTemplates = relatedTemplates.slice(0, 4);

  return <PreviewClient template={template} relatedTemplates={relatedTemplates} />;
}
