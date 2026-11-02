import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataDir = path.join(process.cwd(), "src", "data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      fs.writeFileSync(
        path.join(dataDir, "custom_items.json"),
        JSON.stringify(body.items, null, 2),
        "utf8"
      );
    }

    if (body.categories && Array.isArray(body.categories) && body.categories.length > 0) {
      fs.writeFileSync(
        path.join(dataDir, "custom_categories.json"),
        JSON.stringify(body.categories, null, 2),
        "utf8"
      );
    }

    if (body.bannerSlides && Array.isArray(body.bannerSlides) && body.bannerSlides.length > 0) {
      fs.writeFileSync(
        path.join(dataDir, "custom_banner_slides.json"),
        JSON.stringify(body.bannerSlides, null, 2),
        "utf8"
      );
    }

    return NextResponse.json({
      success: true,
      message: "Foto dan data berhasil disimpan permanen ke server file!",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Gagal menyimpan custom data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "src", "data");
    const itemsPath = path.join(dataDir, "custom_items.json");
    const catsPath = path.join(dataDir, "custom_categories.json");
    const bannerPath = path.join(dataDir, "custom_banner_slides.json");

    let items = null;
    let categories = null;
    let bannerSlides = null;

    if (fs.existsSync(itemsPath)) {
      items = JSON.parse(fs.readFileSync(itemsPath, "utf8"));
    }

    if (fs.existsSync(catsPath)) {
      categories = JSON.parse(fs.readFileSync(catsPath, "utf8"));
    }

    if (fs.existsSync(bannerPath)) {
      bannerSlides = JSON.parse(fs.readFileSync(bannerPath, "utf8"));
    }

    return NextResponse.json({ success: true, items, categories, bannerSlides });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
