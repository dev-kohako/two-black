"use client";

import { InitialSectionSM } from "./InitialSection.sm";
import { InitialSectionMD } from "./InitialSection.md";
import { InitialSectionLG } from "./InitialSection.lg";
import { useMediaQuery } from "@/hooks/use-media";

const sectionId = "home";

export function InitialSection() {
  const isSM = useMediaQuery("(max-width: 767px)");
  const isMD = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");
  const isLG = useMediaQuery("(min-width: 1280px)");

  return (
    <section
      id={sectionId}
      role="region"
      aria-labelledby={`${sectionId}-title`}
      data-section={sectionId}
      className="relative w-full"
    >
      <div className="section-trigger-top" data-section-trigger-top={sectionId} />
      <div className="section-trigger-bottom" data-section-trigger-bottom={sectionId} />

      {isSM ? <InitialSectionSM /> : isMD ? <InitialSectionMD /> : isLG && <InitialSectionLG />}
    </section>
  );
}
