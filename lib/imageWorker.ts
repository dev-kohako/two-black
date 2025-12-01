import { analyzeImage } from "./imageAnalysis";

self.onmessage = async (event) => {
  const { id, src } = event.data;

  try {
    const result = await analyzeImage(src);

    self.postMessage({ id, result, success: true });
  } catch (err: any) {
    self.postMessage({
      id,
      error: err?.message || "Erro",
      success: false,
    });
  }
};
