"use client";

import { motion, useInView } from "framer-motion";
import { Separator } from "@radix-ui/react-separator";
import { useRef } from "react";

export function SectionHeader({ sectionId, motionConfig }: SectionHeaderProps) {
  const { direction, reducedMotion } = motionConfig;

  const isMobileDirection = direction === "x";

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-18%" });

  const baseHidden = {
    opacity: 0,
    x: !reducedMotion && isMobileDirection ? 40 : 0,
    y: !reducedMotion && !isMobileDirection ? 40 : 0,
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  } as const;

  const createVariants = (delay = 0) =>
    ({
      hidden: baseHidden,
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

  return (
    <motion.header
      ref={headerRef}
      variants={containerVariants}
      initial="hidden"
      animate={headerInView ? "visible" : "hidden"}
      className="w-full space-y-6"
    >
      <motion.h2
        id={`${sectionId}-title`}
        variants={createVariants(0.15)}
        className="
          font-black uppercase tracking-tight text-neutral-900
          leading-[0.9]
          text-[clamp(3rem,10vw,6rem)]
        "
      >
        Serviços
      </motion.h2>

      <motion.p
        variants={createVariants(0.3)}
        className="text-lg text-neutral-700 max-w-2xl leading-relaxed"
      >
        Serviços desenvolvidos para elevar marcas, construir narrativas visuais
        sólidas e entregar experiências de alto padrão com precisão estética.
      </motion.p>

      <motion.div variants={createVariants(0.45)}>
        <Separator className="bg-neutral-900/10 h-0.5 w-full" />
      </motion.div>
    </motion.header>
  );
}
