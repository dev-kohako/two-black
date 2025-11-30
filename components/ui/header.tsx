"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useSectionStore } from "@/stores/techFocus";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroolToSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

const creatorStyleMap: Record<
  string,
  {
    linkColor: string;
    header: string;
    logoColor: string;
    hamburgerColor: string;
  }
> = {
  home: {
    linkColor: "text-zinc-900",
    header: "bg-background/70",
    logoColor: "text-zinc-900",
    hamburgerColor: "text-foreground",
  },
  "creator-section-2": {
    linkColor: "text-background",
    header: "bg-[#0937ac95] border-b border-blue-900/80",
    logoColor: "text-background",
    hamburgerColor: "text-background",
  },
  "creator-section-3": {
    linkColor: "text-background",
    header: "bg-[#0e0e0e95] border-b border-foreground/80",
    logoColor: "text-background",
    hamburgerColor: "text-background",
  },
  services: {
    linkColor: "text-zinc-900",
    header: "bg-background/70",
    logoColor: "text-zinc-900",
    hamburgerColor: "text-foreground",
  },
  contact: {
    linkColor: "text-background",
    header: "bg-[#0e0e0e95] border-b border-foreground/80",
    logoColor: "text-background",
    hamburgerColor: "text-background",
  },
};

const NAV_LINKS = [
  { href: "#", label: "Início" },
  { href: "#creator-section-3", label: "Sobre VrsDesigner" },
  { href: "#creator-section-2", label: "Sobre IgorDesigner" },
  { href: "#services", label: "Serviços" },
  { href: "#contact", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const currentSection = useSectionStore((state) => state.currentSection);

  const styles = useMemo(
    () =>
      creatorStyleMap[currentSection] ?? {
        linkColor: "text-cyan-500",
        header: "text-cyan-200",
        logoColor: "text-cyan-200",
        hamburgerColor: "text-cyan-300",
      },
    [currentSection]
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b transition-colors duration-300",
        styles.header
      )}
      role="banner"
    >
      <div className="max-w-6xl mx-auto py-3 px-4 xl:px-0 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/"
            aria-label="Ir para a página inicial"
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                "font-bold text-base sm:text-lg tracking-tight",
                styles.logoColor
              )}
            >
              TwoBlack's
            </span>
          </Link>
        </motion.div>

        <nav
          className="hidden xl:flex items-center gap-2 lg:-mr-4"
          role="navigation"
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map(({ href, label }, index) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Button
                variant="link"
                onClick={() => scrollToSection(href)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  styles.linkColor
                )}
              >
                {label}
              </Button>
            </motion.div>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="xl:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {open ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className={cn("h-6 w-6", styles.hamburgerColor)} />
              )}
            </Button>
          </SheetTrigger>

          <SheetContent
            id="mobile-menu"
            side="top"
            className="p-0 h-screen bg-background/80 backdrop-blur-xl border-none"
            role="dialog"
            aria-modal="true"
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="px-6 pt-12 pb-8 flex flex-col gap-10 h-full"
                >
                  <Link
                    href="/"
                    aria-label="Página inicial"
                    className="flex items-center gap-2"
                  >
                    <span className="font-bold text-lg tracking-tight text-foreground">
                      TwoBlack's
                    </span>
                  </Link>

                  <motion.nav
                    role="navigation"
                    aria-label="Menu mobile"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.2 } },
                    }}
                    className="flex flex-col gap-6 text-lg font-medium"
                  >
                    {NAV_LINKS.map(({ href, label }) => (
                      <motion.button
                        key={href}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.4 }}
                        onClick={() => {
                          scrollToSection(href);
                          setOpen(false);
                        }}
                        className="text-left text-foreground hover:text-foreground/80 transition"
                      >
                        {label}
                      </motion.button>
                    ))}
                  </motion.nav>
                </motion.div>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
