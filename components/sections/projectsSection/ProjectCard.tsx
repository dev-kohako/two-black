"use client";

import { motion, useInView } from "motion/react";
import { LazyVideo } from "./LazyVideo";
import Image from "next/image";
import { useRef, useMemo } from "react";

export function ProjectCard({
  project,
  analysis,
  direction,
  reduced,
  assetBase,
  isLoading,
}: {
  project: Project;
  analysis: any;
  direction: "x" | "y";
  reduced: boolean | null;
  assetBase: string;
  isLoading: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  const variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        x: reduced ? 0 : direction === "x" ? 40 : 0,
        y: reduced ? 0 : direction === "y" ? 40 : 0,
        scale: reduced ? 1 : 0.97,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0.4 },
      },
    }),
    [direction, reduced]
  );

  return (
    <motion.li
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className="
        rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md 
        border border-white/10 shadow-xl p-5
        hover:border-white/20 hover:shadow-2xl 
        transition-all
      "
    >
      <figure className="relative w-full aspect-3/4 mb-5 rounded-xl overflow-hidden">
        {project.type === "video" ? (
          <LazyVideo
            src={`${assetBase}/${project.image}`}
            alt={`Vídeo do projeto ${project.name}`}
          />
        ) : (
          <Image
            src={`${assetBase}/${project.image}`}
            alt={project.name}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="/assets/blur.png"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
          />
        )}
      </figure>

      {isLoading && !analysis && (
        <div className="animate-pulse space-y-4">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-white/10" />
            ))}
          </div>
          <div className="h-3 bg-white/10 rounded w-4/5" />
          <div className="h-3 bg-white/10 rounded w-3/5" />
          <div className="h-3 bg-white/10 rounded w-2/5" />
        </div>
      )}

      {project.type === "image" && analysis && (
        <>
          <div className="flex gap-2 mb-4">
            {analysis.palette.map((c: string) => (
              <div
                key={c}
                role="img"
                aria-label={`Cor dominante ${c}`}
                className="w-5 h-5 rounded-full border border-white/10 shadow-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
            <p>
              <span className="font-semibold text-neutral-100">Estilos:</span>{" "}
              {analysis.style.join(", ")}
            </p>
            <p>
              <span className="font-semibold text-neutral-100">Composição:</span>{" "}
              {analysis.composition}
            </p>
            <p>
              <span className="font-semibold text-neutral-100">Foco:</span>{" "}
              {analysis.focus}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {analysis.tags.map((tag: string) => (
              <span
                key={tag}
                className="
                  px-3 py-1 text-[10px] uppercase tracking-widest 
                  bg-white/10 border border-white/10 rounded-full 
                  text-neutral-100 font-semibold
                "
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}

      {project.type === "video" && (
        <div className="space-y-3 mt-4">
          <span
            className="
            inline-block px-3 py-1 text-[10px] font-semibold uppercase 
            tracking-widest bg-white/10 border border-white/10 rounded-full 
            text-neutral-100
          "
          >
            Vídeo
          </span>

          <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
            <p>
              <span className="font-semibold text-neutral-100">Formato:</span>{" "}
              MP4 / Motion Graphics
            </p>
            <p>
              <span className="font-semibold text-neutral-100">Análise:</span>{" "}
              Não aplicável
            </p>
          </div>
        </div>
      )}
    </motion.li>
  );
}
