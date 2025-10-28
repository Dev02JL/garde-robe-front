import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { type Clothe } from "@/types/clothe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { fileId?: string } | null;
    if (!body?.fileId) {
      return NextResponse.json({ error: "fileId requis" }, { status: 400 });
    }

    const listPath = path.join(process.cwd(), "data/fileList.json");
    const prev = await fs.readFile(listPath, "utf8").catch(() => "[]");
    const arr = JSON.parse(prev) as Clothe[];
    const idx = arr.findIndex((c) => c.fileId === body.fileId);
    if (idx === -1) {
      return NextResponse.json({ error: "fileId introuvable dans fileList.json" }, { status: 404 });
    }
    const rel = arr[idx].imagePath.replace(/^\//, "");
    const absPath = path.join(process.cwd(), "public", rel);
    const bytes = await fs.readFile(absPath);
    const b64 = Buffer.from(bytes).toString("base64");
    const ext = path.extname(absPath).toLowerCase();
    const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg";

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await anthropic.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 400,
      system:
        "Tu es un assistant de mode. Fais une description riche, concise et utile d'un vêtement: matières, couleurs, coupe, style, saison, usage, inspirations possibles.",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Décris précisément ce vêtement pour une fiche produit." },
            { type: "image", source: { type: "base64", media_type: mime, data: b64 } },
          ],
        },
      ],
    });

    const description = msg.content
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("\n")
      .trim();

    arr[idx] = { ...arr[idx], description };
    await fs.writeFile(listPath, JSON.stringify(arr, null, 2));

    return NextResponse.json({ fileId: body.fileId, description }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur d'analyse d'image", details: String(error) },
      { status: 500 },
    );
  }
}

