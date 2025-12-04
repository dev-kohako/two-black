"use client";

import { Whatsapp } from "@/components/icons/whatsapp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { Instagram } from "@/components/icons/instagram";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMemo, useRef } from "react";
import { X } from "lucide-react";

export function ContactDialog({
  creator,
  assetBase,
}: {
  creator: Creator;
  assetBase: string;
}) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  const waLink =
    creator.name === "Vlaisson Ribeiro"
      ? "https://wa.me/558699976417?text=Olá%2C+Vlaisson.+Gostaria+de+informações+sobre+direção+criativa+e+identidade+visual.+Podemos+conversar%3F"
      : "https://wa.me/558688841946?text=Olá%2C+Igor.+Acessei+seu+portfólio+e+gostaria+de+saber+mais+sobre+seus+serviços+de+design.+Pode+me+ajudar%3F";

  const number =
    creator.name === "Vlaisson Ribeiro"
      ? "+55 (86) 99997-6417"
      : "+55 (86) 98884-1946";

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const variants = useMemo(() => {
    if (reduced) {
      return {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 0.4, delay: 0.4 },
        },
      };
    }
    return {
      initial: {
        opacity: 0,
        x: isMobile ? 40 : 0,
        y: isMobile ? 0 : 40,
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.4, delay: 0.4 },
      },
    };
  }, [isMobile, reduced]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={variants}
        >
          <Button
            variant="outline"
            className="bg-transparent px-10 py-6 text-base font-medium"
            aria-label={`Abrir contato de ${creator.name}`}
          >
            Vamos trabalhar juntos
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-sm" />

        <DialogContent
          aria-labelledby="contact-form-title"
          className="
            w-full rounded-2xl border border-white/10 
            bg-background/80 backdrop-blur-xl shadow-2xl px-4 sm:px-6
            max-[400]:max-w-[calc(100vw-4rem)] sm:max-w-lg overflow-y-scroll sm:overflow-hidden
            max-h-[90vh]
          "
          showCloseButton={false}
        >
          <DialogClose className="w-full flex justify-end cursor-pointer">
            <X className="w-5 h-5 text-foreground/80 hover:text-foreground transition" />
          </DialogClose>

          <DialogHeader>
            <DialogTitle
              id="contact-form-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Entre em contato
            </DialogTitle>

            <DialogDescription className="text-sm sm:text-base text-neutral-600 mt-2">
              Envie seu projeto e retornaremos rapidamente com todos os
              detalhes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <Image
              className="w-full min-w-20 max-w-72 min-h-40 object-contain brightness-75"
              src={`${assetBase}/${
                creator.name === "Vlaisson Ribeiro"
                  ? "vrsdsing_qr.png"
                  : "euigordesigner_qr.png"
              }`}
              width={200}
              height={200}
              alt={`QR Code do designer ${creator.name}`}
              sizes="200px"
            />

            <div className="flex flex-col justify-center gap-3 w-full">
              <Button
                variant="ghost"
                className="flex items-center text-xs sm:text-base gap-2 w-full tracking-wider border border-input"
                aria-label={`Designer: ${creator.name}`}
              >
                {creator.name}
              </Button>

              <Button
                asChild
                className="flex items-center text-xs sm:text-base gap-1 w-full"
              >
                <Link
                  href={creator.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram de ${creator.name}`}
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />@
                  {creator.instagramUsername}
                </Link>
              </Button>

              <Button
                asChild
                className="flex items-center text-xs sm:text-base gap-1 w-full"
              >
                <Link
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp de ${creator.name}`}
                >
                  <Whatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                  {number}
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
