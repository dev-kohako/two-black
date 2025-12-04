"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { ServiceCard } from "./ServiceCard";

export function ServicesGrid({ services, motionConfig }: ServicesGridProps) {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-18%" });

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.12,
          delayChildren: 0.25,
        },
      },
    }),
    []
  );

  return (
    <motion.ul
      ref={gridRef}
      role="list"
      aria-label="Lista de serviços oferecidos"
      initial="hidden"
      animate={gridInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="
        grid gap-10 w-full
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {services.map((service) => (
        <ServiceCard
          key={service.title}
          service={service}
          motionConfig={motionConfig}
        />
      ))}
    </motion.ul>
  );
}
