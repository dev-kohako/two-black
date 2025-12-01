"use client";

import { motion } from "framer-motion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="w-full bg-[#0e0e0e] text-background border-t border-foreground flex items-center justify-center py-8 px-4"
    >

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "10%" }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-white/60 text-center leading-relaxed"
      >
        © {year} Two Black's. Todos os direitos reservados.
        <br className="sm:hidden" />
        <span className="ml-1 text-white/40">
          Desenvolvido por{" "}
          <a
            href="https://github.com/dev-kohako"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/60 transition-colors"
          >
            Joseph Kawe — KWK
          </a>
          .
        </span>
      </motion.p>
    </footer>
  );
}
