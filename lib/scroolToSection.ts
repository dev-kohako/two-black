import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export function scrollToSection(target: string) {
  const element =
    target === "#" ? document.body : document.querySelector(target);

  if (!element) return;

  const y =
    target === "#"
      ? 0
      : (element as HTMLElement).getBoundingClientRect().top + window.scrollY;

  gsap.to(window, {
    duration: 1,
    scrollTo: { y, offsetY: -0.5 },
    ease: "power3.out",
  });
}
