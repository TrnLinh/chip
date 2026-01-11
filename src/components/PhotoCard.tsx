import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Photo } from "../data/gallery";

gsap.registerPlugin(ScrollTrigger);

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onPhotoClick?: (photo: Photo) => void;
}

export function PhotoCard({ photo, index, onPhotoClick }: PhotoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const aspectRatioClasses = {
    portrait: "w-[280px] h-[420px]",
    landscape: "w-[420px] h-[280px]",
    square: "w-[320px] h-[320px]",
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Wait for main ScrollTrigger to be set up
    const timeout = setTimeout(() => {
      // Find the main horizontal scroll tween
      const scrollTween = ScrollTrigger.getAll().find((st) => st.vars.pin);
      if (!scrollTween) return;

      // Initial state
      gsap.set(card, {
        opacity: 0,
        scale: 0.9,
        y: 30,
      });

      // Scroll-triggered reveal animation
      const animation = gsap.to(card, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "left 85%",
          end: "left 50%",
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
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`photo-card shrink-0 cursor-pointer ${aspectRatioClasses[photo.aspectRatio || "landscape"]}`}
      style={{ border: "4px solid #000000", backgroundColor: "#e5e5e5" }}
      onClick={() => onPhotoClick?.(photo)}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ backgroundColor: "#cccccc" }}
      >
        <img
          src={photo.src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
