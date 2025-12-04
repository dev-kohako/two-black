"use client";

import { create } from "zustand";

interface SectionState {
  currentSection: string;

  setSection: (section: string) => void;
  resetSection: () => void;
  isSection: (section: string) => boolean;
}

export const useSectionStore = create<SectionState>((set, get) => ({
  currentSection: "home",

  setSection: (section) => set({ currentSection: section }),

  resetSection: () => set({ currentSection: "home" }),

  isSection: (section) => get().currentSection === section,
}));
