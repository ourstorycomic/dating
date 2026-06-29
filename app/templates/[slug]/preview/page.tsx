export const revalidate = 0;
export const dynamic = "force-dynamic";

import { getTemplateBySlug, getPublishedTemplates } from "@/lib/supabase/server";
import { PreviewClient } from "@/components/templates/PreviewClient";

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
  const relatedTemplates = allTemplates
    .filter(t => t.template_categories?.slug === categorySlug && t.slug !== template.slug)
    .slice(0, 4); // Lấy tối đa 4 mẫu gợi ý

  return <PreviewClient template={template} relatedTemplates={relatedTemplates} />;
}
