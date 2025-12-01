"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export function ContactCard({
  name,
  role,
  instagram,
  whatsapp,
  direction,
  reduceMotion,
}: {
  name: string;
  role: string;
  instagram: { handle: string; href: string };
  whatsapp: { number: string; href: string };
  direction: "x" | "y";
  reduceMotion: boolean | null;
}) {
  const isMobileDirection = direction === "x";

  const createVariants = (delay = 0) => ({
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : isMobileDirection ? 40 : 0,
      y: reduceMotion ? 0 : !isMobileDirection ? 40 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.16, 0.84, 0.44, 1],
      },
    },
  } as const);

  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const instaRef = useRef(null);
  const whatsRef = useRef(null);

  const nameInView = useInView(nameRef, { once: true, margin: "-12%" });
  const roleInView = useInView(roleRef, { once: true, margin: "-12%" });
  const instaInView = useInView(instaRef, { once: true, margin: "-12%" });
  const whatsInView = useInView(whatsRef, { once: true, margin: "-12%" });

  return (
    <article
      role="listitem"
      aria-label={`Contato profissional de ${name}`}
      className="space-y-4"
    >
      <motion.h3
        ref={nameRef}
        initial="hidden"
        animate={nameInView ? "visible" : "hidden"}
        variants={createVariants(0.15)}
        className="text-2xl font-bold text-background"
      >
        {name}
      </motion.h3>

      <motion.p
        ref={roleRef}
        initial="hidden"
        animate={roleInView ? "visible" : "hidden"}
        variants={createVariants(0.3)}
        className="text-neutral-400"
      >
        {role}
      </motion.p>

      <ul className="space-y-2 text-lg">
        <motion.li
          ref={instaRef}
          initial="hidden"
          animate={instaInView ? "visible" : "hidden"}
          variants={createVariants(0.45)}
        >
          <span className="opacity-80">Instagram:</span>{" "}
          <Link
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram de ${name}`}
            className="
              underline underline-offset-4 
              hover:text-white transition-colors
              focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-neutral-300 rounded-sm
            "
          >
            {instagram.handle}
          </Link>
        </motion.li>

        <motion.li
          ref={whatsRef}
          initial="hidden"
          animate={whatsInView ? "visible" : "hidden"}
          variants={createVariants(0.6)}
        >
          <span className="opacity-80">Whatsapp:</span>{" "}
          <Link
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp de ${name}`}
            className="
              underline underline-offset-4 
              hover:text-white transition-colors 
              focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-neutral-300 rounded-sm
            "
          >
            {whatsapp.number}
          </Link>
        </motion.li>
      </ul>
    </article>
  );
}
