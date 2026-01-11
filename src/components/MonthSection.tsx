import { useRef } from "react";
import { PhotoCard } from "./PhotoCard";
import { BentoGrid } from "./BentoGrid";
import type { PhaseData, Photo } from "../data/gallery";

interface PhaseSectionProps {
  phase: PhaseData;
  index: number;
  totalPhases: number;
  onPhotoClick?: (photo: Photo) => void;
  isMobile?: boolean;
}

export function PhaseSection({
  phase,
  index,
  totalPhases,
  onPhotoClick,
  isMobile = false,
}: PhaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const isBento = phase.layout === "bento";

  // Mobile layout
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        id={phase.id}
        className="phase-section-mobile"
        data-phase-index={index}
      >
        {/* Phase Title - Horizontal on mobile */}
        <div className="phase-title-mobile-wrapper">
          <span className="phase-number-mobile">Phase {index + 1}</span>
          <h2 className="phase-title-mobile select-none">
            {phase.name}
          </h2>
        </div>

        {/* Photo Content - Bento grid */}
        {isBento ? (
          <div className="w-full">
            <BentoGrid
              photos={phase.photos}
              monthId={phase.id}
              onPhotoClick={onPhotoClick}
              isMobile={isMobile}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 w-full">
            {phase.photos.map((photo, photoIndex) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={photoIndex}
                onPhotoClick={onPhotoClick}
              />
            ))}
          </div>
        )}

        {/* Section Divider - subtle line on mobile */}
        {index < totalPhases - 1 && (
          <div className="w-full flex justify-center py-8">
            <div className="w-16 h-px" style={{ backgroundColor: "#f5e6ef" }} />
          </div>
        )}
      </section>
    );
  }

  // Desktop layout
  return (
    <section
      ref={sectionRef}
      id={phase.id}
      className='flex h-screen shrink-0 items-center justify-center'
      style={{ minWidth: '100vw' }}
      data-phase-index={index}
    >
      {/* Phase Content */}
      <div className='flex flex-col justify-center px-12 py-8'>
        {/* Phase Title - Above the grid */}
        <div className='mb-6'>
          <span className='phase-number'>Phase {index + 1}</span>
          <h2 className='phase-title-horizontal select-none'>
            {phase.name}
          </h2>
        </div>

        {/* Photo Content - Bento or Strip */}
        {isBento ? (
          <BentoGrid
            photos={phase.photos}
            monthId={phase.id}
            onPhotoClick={onPhotoClick}
            isMobile={isMobile}
          />
        ) : (
          <div className='flex items-center gap-6'>
            {phase.photos.map((photo, photoIndex) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={photoIndex}
                onPhotoClick={onPhotoClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section Divider */}
      {index < totalPhases - 1 && (
        <div className='flex h-full items-center px-4'>
          <div className='h-3/4 w-px' style={{ backgroundColor: "#f5e6ef" }} />
        </div>
      )}
    </section>
  );
}

// Legacy alias for backwards compatibility
export const MonthSection = PhaseSection;
