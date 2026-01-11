import { useEffect, useRef, useState, useCallback } from "react";
import { Routes, Route } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { PhaseSection } from "./components/MonthSection";
import { PhaseNav } from "./components/MonthNav";
import { Lightbox } from "./components/Lightbox";
import { PHASES, PUM_SECTIONS, type Photo } from "./data/gallery";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 768;

function HomePage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false
  );

  // Handle responsive breakpoint changes
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Horizontal scroll effect - only on desktop
  useEffect(() => {
    // Skip horizontal scroll setup on mobile
    if (isMobile) {
      // Kill any existing ScrollTrigger instances
      ScrollTrigger.getAll().forEach((st) => st.kill());
      return;
    }

    const wrapper = wrapperRef.current;
    const container = containerRef.current;

    if (!wrapper || !container) return;

    // Calculate the scroll distance
    const getScrollAmount = () => {
      const containerWidth = container.scrollWidth;
      return -(containerWidth - window.innerWidth);
    };

    // Create the horizontal scroll animation
    const tween = gsap.to(container, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${container.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 2,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // Handle resize for ScrollTrigger refresh
    const handleScrollTriggerRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleScrollTriggerRefresh);

    // Refresh ScrollTrigger after content loads to ensure proper width calculation
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Also refresh after window fully loads (including images)
    const handleLoad = () => {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    };
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("resize", handleScrollTriggerRefresh);
      window.removeEventListener("load", handleLoad);
      clearTimeout(refreshTimeout);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isMobile]);

  return (
    <div
      className='relative min-h-screen'
      style={{ backgroundColor: "#fdf8fb" }}
    >
      {/* Year Watermark */}
      <div className='year-watermark' aria-hidden='true'>
        MoMo
      </div>

      {/* Header */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between pb-12 pt-6 ${
          isMobile ? "px-4 pb-8" : "px-8"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, #fdf8fb, rgba(253,248,251,0.95), transparent)",
        }}
      >
        <h1
          className={`font-headline tracking-widest ${
            isMobile ? "text-lg" : "text-2xl"
          }`}
          style={{ color: "#ae2070" }}
        >
          2025's Recap
        </h1>
        <p className='font-body text-sm italic' style={{ color: "#666666" }}>
          A Year in Photos
        </p>
      </header>

      {/* Horizontal Scroll Wrapper */}
      <div ref={wrapperRef} className='horizontal-scroll-wrapper'>
        <div ref={containerRef} className='horizontal-scroll-container'>
          {/* Intro Section */}
          <section
            className={`flex flex-col items-center justify-center ${
              isMobile
                ? "intro-section-mobile min-h-screen w-full px-6 pt-20"
                : "h-screen w-screen shrink-0 px-8"
            }`}
          >
            <h2
              className={`font-display italic ${
                isMobile ? "text-5xl" : "text-6xl md:text-8xl lg:text-9xl"
              }`}
              style={{ color: "#ae2070" }}
            >
              Twenty
            </h2>
            <h2
              className={`font-display ${
                isMobile ? "text-5xl" : "text-6xl md:text-8xl lg:text-9xl"
              }`}
              style={{ color: "#ae2070" }}
            >
              Twenty-Five
            </h2>
            <p
              className='mt-8 max-w-md text-center font-body text-lg'
              style={{ color: "#666666" }}
            >
              MoMo Project Recap for 2025
            </p>
            <div
              className='mt-12 flex items-center gap-2'
              style={{ color: "#ae2070" }}
            >
              <span className='font-headline text-xs tracking-widest'>
                SCROLL
              </span>
              <svg
                className={`h-4 w-4 animate-pulse ${
                  isMobile ? "rotate-90" : ""
                }`}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </div>
          </section>

          {/* Phase Sections */}
          {PHASES.map((phase, index) => (
            <PhaseSection
              key={phase.id}
              phase={phase}
              index={index}
              totalPhases={PHASES.length}
              onPhotoClick={setSelectedPhoto}
              isMobile={isMobile}
            />
          ))}

          {/* Outro Section */}
          <section
            className={`flex flex-col items-center justify-center ${
              isMobile
                ? "outro-section-mobile min-h-[60vh] w-full px-6 py-16"
                : "h-screen w-screen shrink-0 px-8"
            }`}
          >
            <h2
              className={`font-display italic text-black ${
                isMobile ? "text-4xl" : "text-5xl md:text-7xl lg:text-8xl"
              }`}
            >
              Until
            </h2>
            <h2
              className={`font-display text-black ${
                isMobile ? "text-4xl" : "text-5xl md:text-7xl lg:text-8xl"
              }`}
            >
              Next Year
            </h2>
            <p className='mt-8 max-w-md text-center font-body text-lg text-gray'>
              We will see how dumb I can be at the end of 2026
            </p>
            <div className='mt-12 font-headline text-xl tracking-widest text-light-gray'>
              2026
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation */}
      <PhaseNav scrollTo={scrollTo} isMobile={isMobile} />

      {/* Lightbox */}
      <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}

function Pum() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleImageClick = (filename: string) => {
    setSelectedPhoto({
      id: filename,
      src: `/photo/pum/${encodeURIComponent(filename)}`,
      type: "image",
    });
  };

  return (
    <div className='pum-page'>
      <header className='pum-header'>
        <h1 className='font-display'>Pum</h1>
      </header>

      {PUM_SECTIONS.map((section, sectionIndex) => (
        <div key={sectionIndex} className='pum-section'>
          {section.date && (
            <h2 className='pum-section-date font-headline'>{section.date}</h2>
          )}
          <div className='pum-gallery'>
            {section.images.map((filename) => (
              <div
                key={filename}
                className='pum-gallery-item'
                onClick={() => handleImageClick(filename)}
              >
                <img
                  src={`/photo/pum/${encodeURIComponent(filename)}`}
                  alt=''
                  loading='lazy'
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/pum' element={<Pum />} />
    </Routes>
  );
}

export default App;
