"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import type { EmblaPluginType, EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselProps = React.PropsWithChildren<{
  className?: string;
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
}>;

export function Carousel({ className, opts, plugins, children }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start", ...(opts || {}) }, plugins);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm" ref={emblaRef}>
        {children}
      </div>
    </div>
  );
}

export function CarouselContent({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "-ml-4 flex touch-pan-y select-none p-4 [backface-visibility:hidden] will-change-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CarouselItem({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}>
      {children}
    </div>
  );
}

export function CarouselPrevious(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label="Previous slide"
      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 text-foreground shadow-md backdrop-blur hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      {...props}
    >
      <ChevronLeft className="size-4" />
    </button>
  );
}

export function CarouselNext(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label="Next slide"
      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 text-foreground shadow-md backdrop-blur hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      {...props}
    >
      <ChevronRight className="size-4" />
    </button>
  );
}

// Re-export Embla API type for consumers (parité avec la doc shadcn)
export type CarouselApi = EmblaCarouselType;


