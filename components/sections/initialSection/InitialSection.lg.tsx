"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function InitialSectionLG() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const variants = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, x: -60 },
    show: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay },
    }),
  };

  return (
    <section
      role="region"
      aria-labelledby="home-title-lg"
      className="w-full max-w-6xl mx-auto flex min-h-screen items-end justify-between"
    >
      <div className="flex flex-col justify-center min-h-screen pt-40 pb-10 max-w-lg">
        <motion.h1
          id="home-title-lg"
          ref={ref}
          initial="initial"
          animate={inView ? "show" : "initial"}
          variants={variants}
          className="
            uppercase font-black leading-[0.85em]
            text-[clamp(3.4rem,9vw,9rem)]
            -ml-2 tracking-tight
          "
        >
          Port
          <br />
          folio
        </motion.h1>

        <motion.p
          initial="initial"
          animate={inView ? "show" : "initial"}
          variants={variants}
          custom={0.2}
          className="leading-relaxed text-[clamp(0.85rem,1.2vw,1.15rem)] text-foreground/60 max-w-md mt-4"
        >
          Criamos projetos de design para empresas de alto padrão — direcionados
          para impacto, estética e excelência visual.
        </motion.p>

        <motion.div
          initial="initial"
          animate={inView ? "show" : "initial"}
          variants={variants}
          custom={0.4}
          className="mt-10"
        >
          <Button
            size="lg"
            className="
              bg-purple-500 hover:bg-purple-600 
              transition-all text-lg py-6
              text-[clamp(0.875rem,1vw,1rem)] uppercase
              shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30
              text-neutral-200
            "
          >
            Vamos trabalhar juntos
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="-ml-2"
      >
        <Image
          src="/assets/images/IMG_Igor_Vlaisson_PC.png"
          alt="Igor e Vlaisson — Design Premium"
          width={1277}
          height={1680}
          priority
          className="
            object-cover w-[clamp(270px,36vw,710px)]
            drop-shadow-xl select-none pointer-events-none
          "
          sizes="36vw"
        />
      </motion.div>
    </section>
  );
}
