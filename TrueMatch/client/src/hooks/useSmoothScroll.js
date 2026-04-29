import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook — initialises Lenis smooth scroll and synchronises
 * it with GSAP's ScrollTrigger for buttery-smooth scroll-driven
 * animations across the entire app.
 *
 * Features:
 * - Smooth momentum scrolling with eased deceleration
 * - GSAP ScrollTrigger sync for scroll animations
 * - Proper cleanup on unmount
 * - Touch device friendly
 */
const useSmoothScroll = () => {
  useEffect(() => {
    // Don't initialise on very small screens (touch devices scroll natively)
    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Sync Lenis → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Expose lenis instance globally for modals/drawers to pause
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      delete window.__lenis;
    };
  }, []);
};

export default useSmoothScroll;
