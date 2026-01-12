"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import rawData from "@/public/assets/data/data.json";
import { createImageWorker } from "@/lib/imageWorkerLoader";
import type { ImageAnalysis } from "@/lib/imageAnalysis";

type ItemToAnalyze = {
  id: number;
  image: string;
  type: string;
  creatorId: number | number[];
};

type AnalysisState = {
  data: Record<number, ImageAnalysis>;
  isLoading: boolean;
  error: string | null;
  analyzeAll: (items: ItemToAnalyze[]) => Promise<void>;
  clearCache: () => void;
};

const CACHE_KEY = "image-analysis-cache-v1";

function loadCache(): Record<number, ImageAnalysis> {
  if (typeof window === "undefined") return {};
  try {
    const json = localStorage.getItem(CACHE_KEY);
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Record<number, ImageAnalysis>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    
  }
}

let workerInstance: Worker | null = null;

function getImageAnalysisWorker(): Worker | null {
  if (typeof window === "undefined") return null;

  if (!workerInstance) {
    try {
      workerInstance = createImageWorker();

      workerInstance.addEventListener("error", (e) => {
        console.error("[ImageAnalysisWorker] Critical error:", e);
      });
    } catch (err) {
      console.error("[ImageAnalysisWorker] Failed to initialize:", err);
      return null;
    }
  }

  return workerInstance;
}

export const useAnalysis = create<AnalysisState>()(
  subscribeWithSelector((set, get) => {
    const initialCache = loadCache();

    return {
      data: initialCache,
      isLoading: false,
      error: null,

      analyzeAll: async (items) => {
        if (!items?.length || typeof window === "undefined") return;

        const worker = getImageAnalysisWorker();
        if (!worker) {
          set({ error: "Não foi possível inicializar o Web Worker" });
          return;
        }

        const currentCache = loadCache();
        const toProcess = items.filter(
          (item) =>
            item.type !== "video" &&
            /\.(png|jpe?g|webp)$/i.test(item.image) &&
            !currentCache[item.id]
        );

        if (toProcess.length === 0) {
          set({ data: currentCache, isLoading: false, error: null });
          return;
        }

        set({ isLoading: true, error: null });

        const origin = window.location.origin;
        let completed = 0;
        const updatedCache = { ...currentCache };

        return new Promise<void>((resolve) => {
          const onMessage = (e: MessageEvent) => {
            const { id, result, success, type } = e.data ?? {};

            if (type === "ready") return;

            if (success && id !== undefined && result) {
              updatedCache[id] = result;
              saveCache(updatedCache);
              set({ data: { ...updatedCache } });
            }

            completed++;
            if (completed >= toProcess.length) {
              worker.removeEventListener("message", onMessage);
              set({ isLoading: false, error: null });
              resolve();
            }
          };

          worker.addEventListener("message", onMessage);

          toProcess.forEach((item) => {
            const creators = rawData.sobre as { id: number; imageFolder?: string }[];

            const creator = creators.find((c) =>
              Array.isArray(item.creatorId)
                ? item.creatorId.includes(c.id)
                : item.creatorId === c.id
            );

            const folder = creator?.imageFolder ?? "default";
            const fullSrc = `${origin}/assets/${folder}/${item.image}`;

            worker.postMessage({ id: item.id, src: fullSrc });
          });
        });
      },

      clearCache: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(CACHE_KEY);
        }
        set({ data: {}, isLoading: false, error: null });
      },
    };
  })
);