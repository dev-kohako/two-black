"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <section
      aria-label="Carregando conteúdo"
      className="
        w-full min-h-screen flex items-center justify-center
        bg-[#0e0e0e]
      "
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-background text-xl tracking-wider font-semibold"
      >
        Carregando…
      </motion.div>
    </section>
  );
}
