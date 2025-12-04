"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Sparkles,
  Palette,
  Shapes,
  Megaphone,
  Globe,
  Lightbulb,
} from "lucide-react";

import { JSX, useMemo } from "react";

const ICON_MAP: Record<string, JSX.Element> = {
  "Direção Criativa": <Sparkles className="w-7 h-7 text-neutral-900" />,
  "Identidade Visual": <Palette className="w-7 h-7 text-neutral-900" />,
  "Composições Premium": <Shapes className="w-7 h-7 text-neutral-900" />,
  "Campanhas Publicitárias": <Megaphone className="w-7 h-7 text-neutral-900" />,
  "Branding Estratégico": <Globe className="w-7 h-7 text-neutral-900" />,
  "Consultoria Estética": <Lightbulb className="w-7 h-7 text-neutral-900" />,
};

export function ServiceCard({ service, motionConfig }: ServiceCardProps) {
  const { direction, reducedMotion } = motionConfig;

  const variants = useMemo(() => {
    const isMobile = direction === "x";

    return {
      hidden: {
        opacity: 0,
        x: !reducedMotion && isMobile ? 40 : 0,
        y: !reducedMotion && !isMobile ? 40 : 0,
        scale: reducedMotion ? 1 : 0.95,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
        },
      },
    } as const;
  }, [direction, reducedMotion]);

  return (
    <motion.li
      role="listitem"
      aria-label={service.title}
      variants={variants}
      className="h-full"
    >
      <Card
        tabIndex={0}
        className="
          p-8 rounded-2xl border shadow-lg min-h-full h-full
          bg-[#d7d7d78b] backdrop-blur-sm
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl hover:border-neutral-900/20
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-neutral-900 focus-visible:ring-offset-2
          focus-visible:ring-offset-background
        "
      >
        <CardHeader className="p-0 space-y-4">
          <div className="w-fit p-3 rounded-xl bg-transparent border shadow-sm">
            {ICON_MAP[service.title]}
          </div>

          <CardTitle>
            <h3 className="text-[1.35rem] font-bold text-neutral-900 leading-tight">
              {service.title}
            </h3>
          </CardTitle>

          <CardDescription className="text-neutral-600 leading-relaxed text-base">
            {service.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.li>
  );
}
