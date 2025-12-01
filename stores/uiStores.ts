import { create } from "zustand";

export const useUIStore = create((set) => ({
  modalOpen: false,
  setModalOpen: (v: boolean) => set({ modalOpen: v }),
}));
