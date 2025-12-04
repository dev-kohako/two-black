"use client";

import { create } from "zustand";
import rawData from "@/public/assets/data/data.json";
import { ImageAnalysis } from "@/lib/imageAnalysis";
import { createImageWorker } from "@/lib/imageWorkerLoader";

function loadCache(): Record<number, ImageAnalysis> {
  try {
    const data = localStorage.getItem("analysis-cache");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Record<number, ImageAnalysis>) {
  try {
    localStorage.setItem("analysis-cache", JSON.stringify(cache));
  } catch {}
}

export const useAnalysis = create<AnalysisState>((set, get) => ({
  data: {},
  isLoading: false,

  analyzeAll: async (items) => {
    if (typeof window === "undefined") return;

    set({ isLoading: true });

    const worker = createImageWorker();
    const creators = rawData.sobre;
    const cache = loadCache();
    const results: Record<number, ImageAnalysis> = { ...cache };

    const filtered = items.filter((item) => {
      if (item.type === "video") return false;
      return /\.(png|jpg|jpeg)$/i.test(item.image);
    });

    const toAnalyze = filtered.filter((item) => !cache[item.id]);

    if (toAnalyze.length === 0) {
      set({ data: results, isLoading: false });
      return;
    }

    let pending = toAnalyze.length;

    const workerPromise = new Promise<void>((resolve) => {
      worker.onmessage = (event) => {
        const { id, result, success } = event.data;

        if (success) {
          results[id] = result;
          cache[id] = result;
          saveCache(cache);
        }

        pending--;
        if (pending === 0) resolve();
      };
    });

    toAnalyze.forEach((item) => {
      const creator = creators.find((c) => item.creatorId.includes(c.id));
      const folder = creator?.imageFolder || "default";
      const src = `/assets/${folder}/${item.image}`;
      worker.postMessage({ id: item.id, src });
    });

    await workerPromise;

    worker.terminate();

    set({
      data: results,
      isLoading: false,
    });
  },
}));
