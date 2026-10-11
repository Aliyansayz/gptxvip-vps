import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const createScrollTransition = (
  container: HTMLElement,
  pages: HTMLElement[]
) => {
  const ctx = gsap.context(() => {
    // Set initial positions for all pages after the first one
    pages.forEach((page, index) => {
      if (index > 0) {
        gsap.set(page, { x: "100%" });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${pages.length * 100}%`, // Adjust scroll length based on number of pages
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Create sequential transitions between pages
    for (let i = 0; i < pages.length - 1; i++) {
      tl.to(pages[i], { y: "-100%", ease: "none" }, i);
      tl.to(pages[i + 1], { x: "0", ease: "none" }, i);
    }
  }, container);

  return ctx;
};
