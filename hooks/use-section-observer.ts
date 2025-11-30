import { useSectionStore } from "@/stores/techFocus";
import { useEffect } from "react";

export function useSectionObserver() {
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const tops = document.querySelectorAll("[data-section-trigger-top]");
    const bottoms = document.querySelectorAll("[data-section-trigger-bottom]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id =
              entry.target.getAttribute("data-section-trigger-top") ||
              entry.target.getAttribute("data-section-trigger-bottom");

            if (id) {
              setSection(id);
            }
          }
        });
      },
      { threshold: 0.01 }
    );

    tops.forEach((t) => observer.observe(t));
    bottoms.forEach((b) => observer.observe(b));

    return () => observer.disconnect();
  }, [setSection]);
}
