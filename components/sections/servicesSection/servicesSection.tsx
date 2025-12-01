"use client";

import { useMemo, useRef } from "react";
import { useReducedMotion, motion, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { SectionHeader } from "./SectionHeader";
import { ServicesGrid } from "./ServicesGrid";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/scroolToSection";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

const sectionId = "services";

const SERVICES: ServiceItem[] = [
  {
    title: "Direção Criativa",
    description:
      "Concepção estratégica e estética para projetos de alto impacto, garantindo direção visual coesa e marcante.",
  },
  {
    title: "Identidade Visual",
    description:
      "Criação de marcas fortes, consistentes e autorais, pensadas para longevidade e reconhecimento imediato.",
  },
  {
    title: "Composições Premium",
    description:
      "Manipulações avançadas, montagens cinematográficas e edições minuciosas com acabamento profissional.",
  },
  {
    title: "Campanhas Publicitárias",
    description:
      "Peças desenvolvidas para anúncios de alta performance, redes sociais e ativações estratégicas.",
  },
  {
    title: "Branding Estratégico",
    description:
      "Posicionamento, tom de voz e linguagem visual alinhados para elevar marcas a novos patamares.",
  },
  {
    title: "Consultoria Estética",
    description:
      "Acompanhamento criativo para empresas que buscam excelência visual e consistência estética.",
  },
];

export function ServicesSection() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
  }

  const motionConfig: MotionConfig = useMemo(() => {
    if (reduced) return { direction: "none", reducedMotion: true };
    return {
      direction: isMobile ? "x" : "y",
      reducedMotion: false,
    };
  }, [isMobile, reduced]);

  const { direction, reducedMotion } = motionConfig;
  const isMobileDirection = direction === "x";

  const createVariants = (delay = 0) => ({
    hidden: {
      opacity: 0,
      x: reducedMotion ? 0 : isMobileDirection ? 40 : 0,
      y: reducedMotion ? 0 : !isMobileDirection ? 40 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        delay,
        ease: [0.16, 0.84, 0.44, 1],
      },
    },
  } as const);

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-12%" });

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      role="region"
      className="relative w-full flex justify-center min-h-screen px-6 xl:px-0 py-24 bg-background"
    >
      <div className="section-trigger-top" data-section-trigger-top={sectionId} />
      <div className="section-trigger-bottom" data-section-trigger-bottom={sectionId} />

      <div className="w-full md:max-w-4xl xl:max-w-6xl flex flex-col items-start space-y-20">
        <SectionHeader sectionId={sectionId} motionConfig={motionConfig} />

        <ServicesGrid services={SERVICES} motionConfig={motionConfig} />

        <motion.div
          ref={ctaRef}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={createVariants(0.3)}
          className="w-full flex justify-center pt-8"
        >
          <Button
            onClick={() => scrollToSection("#contact")}
            className="
              px-10 py-7 rounded-full text-neutral-200
              text-lg font-medium tracking-wide 
              shadow-xl hover:-translate-y-1
              transition-all duration-300
            "
          >
            Falar com os Designers
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
