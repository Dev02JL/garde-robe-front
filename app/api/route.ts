import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import Anthropic, { toFile } from "@anthropic-ai/sdk";
import { type Clothe } from "@/types/clothe";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    const bytes = new Uint8Array(await file.arrayBuffer());
    const imagesDir = path.join(process.cwd(), "public", "images");

    const ext = path.extname(file.name || "").toLowerCase() || ".jpg";
    const filename = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(imagesDir, filename), bytes);
    const publicPath = `/images/${filename}`;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    const anthropic = new Anthropic({ apiKey });
    const mime = file.type || "image/jpeg";

    const uploaded = await anthropic.beta.files.upload(
      {
        file: await toFile(new Blob([bytes], { type: mime }), filename),
      },
      {
        headers: { "anthropic-beta": "files-api-2025-04-14" },
      },
    );

    const fileId = (uploaded as any).id!;

    const clothe: Clothe = { fileId, imagePath: publicPath };
    return NextResponse.json(clothe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne lors du traitement de l'upload.", details: `${error}` },
      { status: 500 },
    );
  }
}