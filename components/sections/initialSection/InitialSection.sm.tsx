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
import data from "../../../public/assets/data/data.json";

export function InitialSectionSM() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const variants = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, x: -60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
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
      aria-labelledby="home-title"
      className="w-full max-w-xs mx-auto px-4 flex min-h-screen items-center justify-center"
    >
      <motion.div
        ref={ref}
        initial="initial"
        animate={inView ? "show" : "initial"}
        variants={variants}
        className="w-full flex flex-col items-center justify-center"
      >
        <h1 id="home-title" className="sr-only">
          Portfólio – Design Premium
        </h1>

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
                    sizes="90vw"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.div>
    </section>
  );
}
