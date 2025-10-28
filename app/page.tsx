import fs from "node:fs/promises";
import path from "node:path";
import GalleryClient from "@/components/GalleryClient";

export default async function Home() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const entries = await fs.readdir(imagesDir).catch(() => [] as string[]);
  const images = entries
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .map((f) => `/images/${f}`);

  return (
    <div>
      <main className="flex flex-col items-center justify-start gap-6 p-6">
        <GalleryClient initialImages={images} />
      </main>
    </div>
  );
}
