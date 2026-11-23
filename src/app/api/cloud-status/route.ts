import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey || supabaseUrl.includes("placeholder")) {
    return NextResponse.json({ connected: false, reason: "unconfigured" });
  }

  try {
    let fetchError: string | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      signal: controller.signal,
      cache: "no-store",
    }).catch((err: any) => {
      fetchError = err?.message || String(err);
      return null;
    });

    clearTimeout(timeoutId);

    if (res) {
      if (res.ok || res.status === 200 || res.status === 401) {
        return NextResponse.json({ connected: true, status: res.status });
      }
      return NextResponse.json({ connected: false, reason: `http_${res.status}` });
    }

    return NextResponse.json({ connected: false, reason: fetchError || "fetch_null" });
  } catch (err: any) {
    return NextResponse.json({ connected: false, reason: err?.message || "unreachable" });
  }
}
