import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Photo } from "../data/gallery";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

export function Lightbox({ photo, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photo) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (overlay && content) {
      // Animate in
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        content,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (overlay && content) {
      // Animate out
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(content, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!photo) return null;

  return (
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        className="lightbox-close"
        onClick={handleClose}
        aria-label="Close lightbox"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Content */}
      <div ref={contentRef} className="lightbox-content">
        {photo.type === "video" ? (
          <video
            src={photo.src}
            controls
            autoPlay
            loop
            className="lightbox-media"
          />
        ) : (
          <img src={photo.src} alt="" className="lightbox-media" />
        )}
      </div>
    </div>
  );
}

