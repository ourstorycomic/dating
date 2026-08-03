import { NextResponse } from "next/server";
import { getPublishedTemplates } from "@/lib/supabase/server";

export async function GET() {
  try {
    const templates = await getPublishedTemplates();
    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
