import { useRef, useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

interface LazyVideoProps {
  src: string;
  className?: string;
}

export function LazyVideo({ src, className }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
  const [hasLoaded, setHasLoaded] = useState(isMobile); // Load immediately on mobile

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load video source on first visibility
            if (!hasLoaded) {
              setHasLoaded(true);
            }
            // Play when visible
            video.play().catch(() => {
              // Autoplay may be blocked, that's okay
            });
          } else {
            // Pause when not visible to save resources
            video.pause();
          }
        });
      },
      {
        // Start loading a bit before it's fully visible
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [hasLoaded]);

  return (
    <video
      ref={videoRef}
      src={hasLoaded ? src : undefined}
      loop
      muted
      playsInline
      className={className}
      preload={hasLoaded ? "auto" : "none"}
    />
  );
}
