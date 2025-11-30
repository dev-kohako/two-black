import gsap from "gsap";

export function scrollToSection(target: string) {
  const y = target === "#" ? 0 : target;

  gsap.to(window, {
    duration: 1,
    scrollTo: { y, offsetY: -0.5 },
    ease: "power3.out",
  });
}