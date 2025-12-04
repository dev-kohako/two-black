"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section
      className="
        w-full min-h-screen flex flex-col items-center justify-center
        text-center px-6 bg-[#0e0e0e] text-background
      "
      aria-labelledby="not-found-title"
      role="alert"
    >
      <motion.h1
        id="not-found-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          text-[clamp(4rem,12vw,10rem)]
          font-black tracking-tight leading-none
        "
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-lg text-neutral-300 max-w-md mt-4 leading-relaxed"
      >
        A página que você procura não existe — mas podemos criar algo incrível
        juntos.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-10"
      >
        <Button
          asChild
          size="lg"
          variant="outline"
          className="px-10 py-7 text-lg tracking-wide"
        >
          <Link href="/">Voltar ao início</Link>
        </Button>
      </motion.div>
    </section>
  );
}
