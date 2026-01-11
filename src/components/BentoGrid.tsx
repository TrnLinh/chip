import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Photo } from "../data/gallery";
import { LazyVideo } from "./LazyVideo";
import { LazyImage } from "./LazyImage";

gsap.registerPlugin(ScrollTrigger);

interface BentoGridProps {
  photos: Photo[];
  monthId: string;
  onPhotoClick?: (photo: Photo) => void;
  isMobile?: boolean;
}

export function BentoGrid({ photos, monthId, onPhotoClick, isMobile = false }: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip GSAP animations on mobile - not needed with vertical scroll
    if (isMobile) return;

    const grid = gridRef.current;
    if (!grid) return;

    const timeout = setTimeout(() => {
      const scrollTween = ScrollTrigger.getAll().find((st) => st.vars.pin);
      if (!scrollTween) return;

      // Single animation for the whole grid instead of per-item
      gsap.set(grid, { opacity: 0, y: 30 });

      const animation = gsap.to(grid, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: grid,
          start: "left 80%",
          containerAnimation: scrollTween.animation,
          toggleActions: "play none none reverse",
        },
      });

      return () => {
        animation.scrollTrigger?.kill();
        animation.kill();
      };
    }, 150);

    return () => clearTimeout(timeout);
  }, [monthId, isMobile]);

  return (
    <div ref={gridRef} className={`bento-grid bento-grid-${monthId}`}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`bento-item bento-${photo.gridArea || "default"} cursor-pointer`}
          onClick={() => onPhotoClick?.(photo)}
        >
          <div className='bento-image-wrapper'>
            {photo.type === "video" ? (
              <LazyVideo src={photo.src} className='bento-video' />
            ) : (
              <LazyImage src={photo.src} className='bento-image' />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
