"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import data from "../../../public/assets/data/data.json";

export function InitialSectionMD() {
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

  const plugin = useMemo(
    () =>
      Autoplay({
        delay: 3200,
        stopOnInteraction: true,
        stopOnFocusIn: true,
      }),
    []
  );

  return (
    <section
      role="region"
      aria-labelledby="home-title-md"
      className="w-full max-w-4xl mx-auto flex flex-col min-h-screen items-center justify-center px-6"
    >
      <div className="flex flex-col justify-center items-center pt-16 pb-4 max-w-2xl mx-auto">
        <motion.h1
          id="home-title-md"
          ref={ref}
          initial="initial"
          animate={inView ? "show" : "initial"}
          variants={variants}
          className="
            uppercase font-black leading-[0.85em]
            text-[clamp(3.4rem,10vw,6.4rem)]
            -ml-1 tracking-tight
          "
        >
          Portfolio
        </motion.h1>

        <motion.p
          initial="initial"
          animate={inView ? "show" : "initial"}
          variants={variants}
          custom={0.2}
          className="leading-relaxed text-[clamp(0.85rem,1.2vw,1rem)] text-foreground/60 max-w-md mt-4 text-center"
        >
          Criamos projetos de design para empresas de alto padrão <br />
          direcionados para impacto, estética e excelência visual.
        </motion.p>
      </div>

      <Carousel
        plugins={[plugin]}
        className="w-full max-w-xs"
        onMouseEnter={plugin.stop}
        onMouseLeave={plugin.reset}
        opts={{ loop: true }}
        aria-label="Carrossel de designers Igor e Vlaisson"
      >
        <CarouselContent>
          {data.sobre.map((item, index) => (
            <CarouselItem key={item.id ?? index}>
              <div className="p-1 pt-6">
                <Image
                  src={`/assets/images/${item.image}`}
                  alt={`Imagem de ${item.name}`}
                  width={500}
                  height={500}
                  loading="eager"
                  className="object-cover"
                  sizes="60vw"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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
    </section>
  );
}
