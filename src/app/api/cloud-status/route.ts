import { NextResponse } from "next/server";
import dns from "dns/promises";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Jika URL tidak diatur atau placeholder, mode offline lokal
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return NextResponse.json({ connected: false, reason: "unconfigured" });
  }

  try {
    const parsedUrl = new URL(supabaseUrl);

    // 1. Cek DNS hostname di server (Node.js) agar tidak ada ERR_NAME_NOT_RESOLVED di console browser
    await dns.lookup(parsedUrl.hostname);

    // 2. Jika DNS ada, cek kesehatan endpoint Supabase
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: "GET",
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (res && (res.ok || res.status === 200)) {
      return NextResponse.json({ connected: true });
    }

    return NextResponse.json({ connected: false, reason: "endpoint_unresponsive" });
  } catch (err: any) {
    // Tangani DNS failure (ENOTFOUND) secara aman di server
    return NextResponse.json({ connected: false, reason: err?.code || "unreachable" });
  }
}
