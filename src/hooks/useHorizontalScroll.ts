import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseHorizontalScrollOptions {
  ease?: string;
  scrub?: number | boolean;
}

export function useHorizontalScroll(options: UseHorizontalScrollOptions = {}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const { ease = 'none', scrub = 1 } = options;

  useEffect(() => {
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
      ease,
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${container.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    scrollTriggerRef.current = tween.scrollTrigger as ScrollTrigger;

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ease, scrub]);

  // Get scroll progress for a specific section
  const getProgress = () => {
    return scrollTriggerRef.current?.progress ?? 0;
  };

  // Scroll to a specific section by index
  const scrollToSection = (index: number, totalSections: number) => {
    if (!scrollTriggerRef.current) return;
    
    const progress = index / (totalSections - 1);
    const scrollY = scrollTriggerRef.current.start + 
      (scrollTriggerRef.current.end - scrollTriggerRef.current.start) * progress;
    
    gsap.to(window, {
      scrollTo: { y: scrollY },
      duration: 1,
      ease: 'power2.inOut',
    });
  };

  return {
    wrapperRef,
    containerRef,
    getProgress,
    scrollToSection,
    scrollTrigger: scrollTriggerRef,
  };
}

