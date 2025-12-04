"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { ContactCard } from "./contactCard";
import { useRef, useMemo } from "react";

export function ContactSection() {
  const sectionId = "contact";
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  const direction: "x" | "y" = isMobile ? "x" : "y";
  const isMobileDirection = direction === "x";

  const variants = useMemo(
    () =>
      (delay = 0) =>
        ({
          hidden: {
            opacity: 0,
            x: reduced ? 0 : isMobileDirection ? 40 : 0,
            y: reduced ? 0 : !isMobileDirection ? 40 : 0,
          },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
              duration: 0.4,
              delay,
            },
          },
        } as const),
    [isMobileDirection, reduced]
  );

  const titleRef = useRef(null);
  const descRef = useRef(null);

  const titleInView = useInView(titleRef, { once: true, margin: "-12%" });
  const descInView = useInView(descRef, { once: true, margin: "-12%" });

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      role="region"
      data-section={sectionId}
      className="
        relative w-full flex justify-center min-h-screen
        px-6 xl:px-0 py-24
        bg-[#0e0e0e] text-background
      "
    >
      <div className="section-trigger-top" data-section-trigger-top={sectionId} />
      <div className="section-trigger-bottom" data-section-trigger-bottom={sectionId} />

      <div className="w-full md:max-w-4xl xl:max-w-6xl flex flex-col items-start justify-center space-y-16">
        <header className="space-y-6 max-w-3xl">
          <motion.h2
            ref={titleRef}
            id={`${sectionId}-title`}
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
            variants={variants(0)}
            className="
              font-black uppercase tracking-tight
              leading-[0.9]
              text-[clamp(3.5rem,10vw,6rem)]
            "
          >
            Contato
          </motion.h2>

          <motion.p
            ref={descRef}
            initial="hidden"
            animate={descInView ? "visible" : "hidden"}
            variants={variants(0.2)}
            className="text-lg text-neutral-300 max-w-xl leading-relaxed"
          >
            Entre em contato para solicitações, orçamentos, direcionamento criativo
            ou parcerias profissionais.
          </motion.p>
        </header>

        <div
          role="list"
          aria-label="Contatos profissionais"
          className="grid sm:grid-cols-2 gap-12 w-full"
        >
          <ContactCard
            name="Igor Fernandes"
            role="Designer • Direção Criativa"
            instagram={{
              handle: "@euigordesigner",
              href: "https://instagram.com/euigordesigner",
            }}
            whatsapp={{
              number: "+55 (86) 98884-1946",
              href: "https://wa.me/558688841946?text=Olá%2C+Igor.+Acessei+seu+portfólio+e+gostaria+de+saber+mais+sobre+seus+serviços+de+design.+Pode+me+ajudar%3F",
            }}
            direction={direction}
            reduceMotion={reduced}
          />

          <ContactCard
            name="Vlaisson Ribeiro"
            role="Designer • Composições Premium • Motion Design"
            instagram={{
              handle: "@vrsdsing",
              href: "https://instagram.com/vrsdsing",
            }}
            whatsapp={{
              number: "+55 (86) 99997-6417",
              href: "https://wa.me/558699976417?text=Olá%2C+Vlaisson.+Gostaria+de+informações+sobre+direção+criativa+e+identidade+visual.+Podemos+conversar%3F",
            }}
            direction={direction}
            reduceMotion={reduced}
          />
        </div>
      </div>
    </section>
  );
}
