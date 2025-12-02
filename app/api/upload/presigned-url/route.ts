import { NextRequest, NextResponse } from "next/server";
import { generatePresignedUploadUrl } from "@/lib/r2/upload";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, folder } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    const result = await generatePresignedUploadUrl(
      fileName,
      fileType,
      folder || "memories"
    );

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Failed to generate presigned URL", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
