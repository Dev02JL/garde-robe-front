"use client";

import * as React from "react";
import ImagesCarousel from "@/components/ImagesCarousel";
import ImageUploadForm from "@/components/ImageUploadForm";

export default function GalleryClient({ initialImages }: { initialImages: string[] }) {
  const [images, setImages] = React.useState<string[]>(initialImages);

  return (
    <div className="w-full">
      <ImagesCarousel images={images} />
      <ImageUploadForm
        onUploaded={(imagePath) => {
          if (!imagePath) return;
          setImages((prev) => (prev.includes(imagePath) ? prev : [...prev, imagePath]));
        }}
      />
    </div>
  );
}


