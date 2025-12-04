"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("TwoBlack Error:", error);
  }, [error]);

  return (
    <section
      aria-labelledby="error-title"
      className="
        w-full min-h-screen flex flex-col items-center justify-center
        text-center px-6 bg-[#0e0e0e] text-background
      "
      role="alert"
    >
      <motion.h2
        id="error-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          text-[clamp(3rem,10vw,6rem)]
          font-black tracking-tight leading-none
        "
      >
        Algo deu errado
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-lg text-neutral-300 max-w-lg mt-4"
      >
        Nosso sistema detectou um erro inesperado. Você pode tentar novamente.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-10 flex gap-4"
      >
        <Button size="lg" variant="outline" onClick={reset} className="px-10 py-7">
          Tentar novamente
        </Button>
      </motion.div>
    </section>
  );
}
