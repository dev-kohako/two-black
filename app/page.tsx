"use client";

import Header from "@/components/ui/header";
import { ProjectsSection } from "@/components/sections/projectsSection/projectsSection";
import { InitialSection } from "@/components/sections/initialSection/initialSection";
import rawData from "../public/assets/data/data.json";
import { useSectionObserver } from "@/hooks/use-section-observer";
import { useEffect, useMemo } from "react";
import { useAnalysis } from "@/stores/useAnalysis";
import { ContactSection } from "@/components/sections/contactSection/contactSection";
import { ServicesSection } from "@/components/sections/servicesSection/servicesSection";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  const creators = rawData.sobre as Creator[];
  const projects = rawData.projetos as Project[];

  const sortedCreators = useMemo(
    () =>
      [...creators].sort((a, b) =>
        a.name === "Vlaisson Ribeiro" ? -1 : b.name === "Vlaisson Ribeiro" ? 1 : 0
      ),
    [creators]
  );

  useSectionObserver();

  const { analyzeAll } = useAnalysis();

  useEffect(() => {
    analyzeAll(projects);
  }, [analyzeAll, projects]);

  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden">
      <Header />

      <main
        role="main"
        aria-label="Conteúdo principal"
        className="w-full flex flex-col items-center"
      >
        <InitialSection />

        <Footer />
      </main>
    </div>
  );
}
