"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function ImagesCarousel({ images }: { images: string[] }) {
  return (
    <Carousel
      className="w-full max-w-5xl"
      plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
    >
      <CarouselContent className="-ml-3">
        {images.map((src) => (
          <CarouselItem key={src} className="pl-3 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <Card className="rounded-xl border shadow-md transition hover:shadow-lg">
                <CardContent className="flex h-80 items-center justify-center p-3">
                  <Image
                    src={src}
                    alt={src.split("/").pop() || "image"}
                    width={500}
                    height={500}
                    className="h-full w-full rounded-lg object-contain transition-transform duration-200 hover:scale-[1.02]"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}


