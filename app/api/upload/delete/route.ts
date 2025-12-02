import { NextRequest, NextResponse } from "next/server";
import { deleteByUrl } from "@/lib/r2/upload";
import { logger } from "@/lib/logger";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "url is required" },
        { status: 400 }
      );
    }

    await deleteByUrl(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete file", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
