import { create } from "zustand";

export const useSectionStore = create<SectionState>((set) => ({
  currentSection: "home",
  setSection: (section) => set(() => ({ currentSection: section })),
}));
