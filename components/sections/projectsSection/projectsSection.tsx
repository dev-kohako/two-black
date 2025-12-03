"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalysis } from "@/stores/useAnalysis";
import { motion, useReducedMotion, useInView } from "motion/react";
import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { ContactDialog } from "./ContactDialog";

const creatorStyleMap: Record<
  string,
  { title: string; description: string; badge: string }
> = {
  "Vlaisson Ribeiro": {
    title: "text-background",
    description: "text-purple-200",
    badge: "bg-purple-600",
  },
  "Igor Fernandes": {
    title: "text-background",
    description: "text-red-200",
    badge: "bg-red-600",
  },
};

export function ProjectsSection({ creator, projects }: ProjectsSectionProps) {
  const { data: analysisData, isLoading } = useAnalysis();
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setIsReady(true), []);

  const sectionId = `creator-section-${creator.id}`;
  const assetBase = `/assets/${creator.imageFolder}`;

  const styles = creatorStyleMap[creator.name] ?? {
    title: "text-cyan-500",
    description: "text-cyan-200",
    badge: "bg-cyan-600",
  };

  const variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        x: reduced ? 0 : isMobile ? 40 : 0,
        y: reduced ? 0 : !isMobile ? 40 : 0,
      },
      visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.4, delay },
      }),
    }),
    [isMobile, reduced]
  );

  const avatarRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);

  const avatarInView = useInView(avatarRef, { once: true, margin: "-10%" });
  const nameInView = useInView(nameRef, { once: true, margin: "-10%" });
  const descInView = useInView(descRef, { once: true, margin: "-10%" });

  const figureRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);

  const figureInView = useInView(figureRef, { once: true, margin: "-15%" });
  const titleInView = useInView(titleRef, { once: true, margin: "-15%" });
  const textInView = useInView(textRef, { once: true, margin: "-15%" });

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      role="region"
      className="relative w-full flex justify-center min-h-screen px-6 xl:px-0 py-24"
      style={{ background: creator.color }}
    >
      <div className="section-trigger-top" data-section-trigger-top={sectionId} />
      <div className="section-trigger-bottom" data-section-trigger-bottom={sectionId} />

      <div className="w-full md:max-w-4xl xl:max-w-6xl space-y-20">
        <header className="text-center space-y-3">
          <motion.div
            ref={avatarRef}
            initial="hidden"
            animate={avatarInView ? "visible" : "hidden"}
            variants={variants}
            custom={0}
            className="flex justify-center"
          >
            <Image
              src={`/assets/images/${creator.imagePc}`}
              alt={`Foto de perfil de ${creator.name}`}
              width={100}
              height={100}
              className="h-14 w-14 rounded-full object-cover border border-white/20 shadow-xl"
              sizes="56px"
              placeholder="blur"
              blurDataURL="/assets/blur.png"
              priority
            />
          </motion.div>

          <motion.h2
            ref={nameRef}
            id={`${sectionId}-title`}
            initial="hidden"
            animate={nameInView ? "visible" : "hidden"}
            variants={variants}
            custom={0.2}
            className={cn("text-4xl font-black tracking-tight", styles.title)}
          >
            {creator.name}
          </motion.h2>

          <motion.p
            ref={descRef}
            initial="hidden"
            animate={descInView ? "visible" : "hidden"}
            variants={variants}
            custom={0.4}
            className="text-sm text-white/80 -mt-2"
          >
            Projetos assinados por{" "}
            <a
              href={creator.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-white"
            >
              @{creator.instagramUsername}
            </a>
          </motion.p>
        </header>

        <div className="w-full mt-12">
          <ul
            role="list"
            aria-label={`Projetos de ${creator.name}`}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
          >
            {!isReady &&
              Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={i}
                  className="rounded-2xl bg-white/5 border border-white/10 shadow-xl p-5 animate-pulse"
                />
              ))}

            {isReady &&
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  analysis={analysisData[project.id]}
                  isLoading={isLoading}
                  direction={isMobile ? "x" : "y"}
                  reduced={reduced}
                  assetBase={assetBase}
                />
              ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-center">
          <motion.figure
            ref={figureRef}
            initial="hidden"
            animate={figureInView ? "visible" : "hidden"}
            variants={variants}
            custom={0}
            className="relative md:w-full aspect-3/4 rounded-xl overflow-hidden"
          >
            <Image
              src={`/assets/images/${creator.imagePc}`}
              alt={`Retrato do designer ${creator.name}`}
              fill
              className="object-contain"
              placeholder="blur"
              blurDataURL="/assets/blur.png"
              sizes="(max-width: 768px) 90vw, 400px"
            />
          </motion.figure>

          <div className="space-y-10 text-neutral-100 lg:px-4">
            <motion.h3
              ref={titleRef}
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={variants}
              custom={0}
              className="
                font-black uppercase leading-none mb-0
                whitespace-pre-line
                text-[clamp(4rem,16vw,6rem)]
                md:text-[clamp(4rem,10vw,8rem)]
                lg:text-[clamp(6rem,10vw,8rem)]
                xl:text-[clamp(7rem,10vw,8rem)]
              "
            >
              {creator.name === "Vlaisson Ribeiro" ? "Vrs\nDesign" : "Igor\nDesign"}
            </motion.h3>

            <motion.p
              ref={textRef}
              initial="hidden"
              animate={textInView ? "visible" : "hidden"}
              variants={variants}
              custom={0.2}
              className="text-white/80 text-lg leading-relaxed max-w-md"
            >
              Especialista em direção criativa, identidade visual e composições
              sofisticadas. Cada projeto é desenvolvido para comunicar força,
              estética e propósito.
            </motion.p>

            <ContactDialog creator={creator} assetBase={assetBase} />
          </div>
        </div>
      </div>
    </section>
  );
}
