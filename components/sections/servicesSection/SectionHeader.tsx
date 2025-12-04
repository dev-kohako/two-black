"use client";

import { motion, useInView } from "framer-motion";
import { Separator } from "@radix-ui/react-separator";
import { useRef, useMemo } from "react";

export function SectionHeader({ sectionId, motionConfig }: SectionHeaderProps) {
  const { direction, reducedMotion } = motionConfig;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-18%" });

  const variants = useMemo(() => {
    const isMobile = direction === "x";

    const hidden = {
      opacity: 0,
      x: !reducedMotion && isMobile ? 40 : 0,
      y: !reducedMotion && !isMobile ? 40 : 0,
    };

    return {
      container: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
          },
        },
      },
      item: (delay = 0) => ({
        hidden,
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.4, delay },
        },
      }),
    };
  }, [direction, reducedMotion]);

  return (
    <motion.header
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants.container}
      aria-labelledby={`${sectionId}-title`}
      className="w-full space-y-6"
    >
      <motion.h2
        id={`${sectionId}-title`}
        variants={variants.item(0)}
        className="
          font-black uppercase tracking-tight text-neutral-900
          leading-[0.9]
          text-[clamp(3rem,10vw,6rem)]
        "
      >
        Serviços
      </motion.h2>

      <motion.p
        variants={variants.item(0.2)}
        className="text-lg text-neutral-700 max-w-2xl leading-relaxed"
      >
        Serviços desenvolvidos para elevar marcas, construir narrativas visuais
        sólidas e entregar experiências de alto padrão com precisão estética.
      </motion.p>

      <motion.div variants={variants.item(0.4)}>
        <Separator className="bg-neutral-900/10 h-0.5 w-full" />
      </motion.div>
    </motion.header>
  );
}
