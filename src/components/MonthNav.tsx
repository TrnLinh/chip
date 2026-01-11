import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHASES } from "../data/gallery";

gsap.registerPlugin(ScrollTrigger);

interface PhaseNavProps {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
    }
  ) => void;
  isMobile?: boolean;
}

export function PhaseNav({ scrollTo, isMobile = false }: PhaseNavProps) {
  const [activePhase, setActivePhase] = useState(-1); // -1 = intro section
  const navRef = useRef<HTMLDivElement>(null);

  // Mobile: Update active phase based on scroll position
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      let foundPhase = -1;
      PHASES.forEach((phase, index) => {
        const section = document.getElementById(phase.id);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionBottom = sectionTop + rect.height;

        // Check if section is in view (using center of viewport)
        const viewportCenter = scrollY + windowHeight / 2;
        if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
          foundPhase = index;
        }
      });

      setActivePhase(foundPhase);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Desktop: Update active phase based on GSAP horizontal scroll
  useEffect(() => {
    if (isMobile) return;

    // Wait for ScrollTrigger to be set up
    const timeout = setTimeout(() => {
      const mainTrigger = ScrollTrigger.getAll().find((st) => st.vars.pin);
      if (!mainTrigger) return;

      // Update active phase based on scroll progress
      const updateActivePhase = () => {
        const container = document.querySelector(
          ".horizontal-scroll-container"
        ) as HTMLElement;
        if (!container) return;

        const windowWidth = window.innerWidth;

        // Get current horizontal position from GSAP transform
        const transform = gsap.getProperty(container, "x") as number;
        const currentX = Math.abs(transform || 0);

        // Find which phase section is currently in view
        let foundPhase = -1;
        PHASES.forEach((phase, index) => {
          const section = document.getElementById(phase.id);
          if (!section) return;

          const sectionLeft = section.offsetLeft;
          const sectionRight = sectionLeft + section.offsetWidth;

          // Check if the center of the viewport is within this section
          const viewportCenter = currentX + windowWidth / 2;
          if (viewportCenter >= sectionLeft && viewportCenter < sectionRight) {
            foundPhase = index;
          }
        });

        setActivePhase(foundPhase);
      };

      // Listen to scroll events
      ScrollTrigger.addEventListener("refresh", updateActivePhase);

      // Create a ticker to update on scroll
      const tickerCallback = () => {
        updateActivePhase();
      };
      gsap.ticker.add(tickerCallback);

      return () => {
        ScrollTrigger.removeEventListener("refresh", updateActivePhase);
        gsap.ticker.remove(tickerCallback);
      };
    }, 100);

    return () => clearTimeout(timeout);
  }, [isMobile]);

  // Scroll active button into view on mobile
  useEffect(() => {
    if (isMobile && navRef.current && activePhase >= 0) {
      const buttons = navRef.current.querySelectorAll('button');
      const activeButton = buttons[activePhase];
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activePhase, isMobile]);

  const handlePhaseClick = (phaseId: string) => {
    const section = document.getElementById(phaseId);
    if (!section) return;

    if (isMobile) {
      // Mobile: Use native smooth scroll
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Desktop: Calculate GSAP scroll position
    const container = document.querySelector(
      ".horizontal-scroll-container"
    ) as HTMLElement;
    const wrapper = document.querySelector(
      ".horizontal-scroll-wrapper"
    ) as HTMLElement;
    if (!container || !wrapper) return;

    const containerWidth = container.scrollWidth;
    const windowWidth = window.innerWidth;
    const totalHorizontalScroll = containerWidth - windowWidth;

    // Get the section's left position (with small offset for title visibility)
    const sectionLeft = Math.max(0, section.offsetLeft - 50);

    // Calculate progress (0 to 1) through the horizontal scroll
    const progress = Math.min(sectionLeft / totalHorizontalScroll, 1);

    // The vertical scroll range equals the horizontal scroll distance
    // (because scrub maps 1:1 vertical scroll to horizontal movement)
    const wrapperTop = wrapper.offsetTop;
    const targetScrollY = wrapperTop + totalHorizontalScroll * progress;

    scrollTo(targetScrollY, { duration: 1.2 });
  };

  // Mobile navigation: horizontally scrollable pills
  if (isMobile) {
    return (
      <nav
        className='fixed bottom-0 left-0 right-0 z-50 pb-4 pt-8'
        style={{
          background:
            "linear-gradient(to top, #fdf8fb, rgba(253,248,251,0.95), transparent)",
        }}
      >
        <div 
          ref={navRef}
          className='phase-nav-mobile overflow-x-auto'
        >
          <div className='nav-inner flex items-center justify-center gap-2 px-4'>
            {PHASES.map((phase, index) => (
              <button
                key={phase.id}
                onClick={() => handlePhaseClick(phase.id)}
                className={`nav-text px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                  activePhase === index 
                    ? 'text-white' 
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activePhase === index ? '#ae2070' : 'transparent',
                  color: activePhase === index ? '#ffffff' : '#ae2070',
                }}
                aria-label={`Go to ${phase.name}`}
              >
                {phase.shortName}
              </button>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // Desktop navigation
  return (
    <nav
      className='fixed bottom-0 left-0 right-0 z-50 pb-6 pt-12'
      style={{
        background:
          "linear-gradient(to top, #fdf8fb, rgba(253,248,251,0.95), transparent)",
      }}
    >
      <div className='flex items-center justify-center gap-8'>
        {PHASES.map((phase, index) => (
          <button
            key={phase.id}
            onClick={() => handlePhaseClick(phase.id)}
            className='nav-text px-4 py-2 transition-all duration-300'
            style={{
              color: activePhase === index ? "#ae2070" : "#666666",
            }}
            aria-label={`Go to ${phase.name}`}
          >
            <span className='relative'>
              {phase.name}
              {activePhase === index && (
                <span
                  className='absolute -bottom-1 left-0 right-0 h-0.5'
                  style={{ backgroundColor: "#ae2070" }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Legacy alias for backwards compatibility
export const MonthNav = PhaseNav;
