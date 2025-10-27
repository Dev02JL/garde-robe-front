import fs from "node:fs/promises";
import path from "node:path";
import ImagesCarousel from "@/components/ImagesCarousel";

export default async function Home() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const entries = await fs.readdir(imagesDir).catch(() => [] as string[]);
  const images = entries
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .map((f) => `/images/${f}`);

  return (
    <div>
      <main className="flex min-h-screen items-center justify-center p-6">
        <ImagesCarousel images={images} />
      </main>
    </div>
  );
}
