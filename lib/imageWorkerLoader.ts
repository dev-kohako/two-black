"use client";

export function createImageWorker() {
  return new Worker(new URL("./imageWorker.ts", import.meta.url), {
    type: "module",
  });
}
