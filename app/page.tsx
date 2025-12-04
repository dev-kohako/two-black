"use client";

import { useEffect, useMemo } from "react";
import Header from "@/components/ui/header";
import { InitialSection } from "@/components/sections/initialSection/initialSection";
import { ProjectsSection } from "@/components/sections/projectsSection/projectsSection";
import { ServicesSection } from "@/components/sections/servicesSection/servicesSection";
import { ContactSection } from "@/components/sections/contactSection/contactSection";
import { Footer } from "@/components/ui/footer";

import { useAnalysis } from "@/stores/useAnalysis";
import { useSectionObserver } from "@/hooks/use-section-observer";

import rawData from "../public/assets/data/data.json";

export default function Home() {
  const creators = rawData.sobre as Creator[];
  const projects = rawData.projetos as Project[];

  const sortedCreators = useMemo(() => {
    const arr = [...creators];
    return arr.sort((a, b) =>
      a.name === "Vlaisson Ribeiro"
        ? -1
        : b.name === "Vlaisson Ribeiro"
        ? 1
        : 0
    );
  }, [creators]);

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
        aria-label="Conteúdo principal do portfólio Two Black’s"
        className="w-full flex flex-col items-center"
      >
        <InitialSection />

        {sortedCreators.map((creator) => {
          const creatorProjects = projects.filter((p) =>
            p.creatorId.includes(creator.id)
          );

          if (!creatorProjects.length) return null;

          return (
            <ProjectsSection
              key={creator.id}
              creator={creator}
              projects={creatorProjects}
            />
          );
        })}

        <ServicesSection />

        <ContactSection />

        <Footer />
      </main>
    </div>
  );
}
