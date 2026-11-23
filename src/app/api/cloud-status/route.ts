import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Jika URL tidak diatur atau placeholder, mode offline lokal
  if (!supabaseUrl || !anonKey || supabaseUrl.includes("placeholder")) {
    return NextResponse.json({ connected: false, reason: "unconfigured" });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      signal: controller.signal,
    }).catch((err) => {
      return null;
    });

    clearTimeout(timeoutId);

    if (res && (res.ok || res.status === 200 || res.status === 401)) {
      return NextResponse.json({ connected: true });
    }

    return NextResponse.json({ connected: false, reason: "endpoint_unresponsive" });
  } catch (err: any) {
    return NextResponse.json({ connected: false, reason: err?.message || "unreachable" });
  }
}
