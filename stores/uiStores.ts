"use client";

import { create } from "zustand";

interface UIState {
  modalOpen: boolean;

  setModalOpen: (value: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  modalOpen: false,

  setModalOpen: (value) => set({ modalOpen: value }),
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
  toggleModal: () => set((s) => ({ modalOpen: !s.modalOpen })),
}));
