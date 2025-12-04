import { analyzeImage } from "./imageAnalysis";

self.onmessage = async (event: MessageEvent) => {
  const { id, src } = event.data;

  try {
    const result = await analyzeImage(src);

    self.postMessage({
      id,
      result,
      success: true,
    });
  } catch (error: any) {
    self.postMessage({
      id,
      error: error?.message ?? "Unknown error while analyzing image",
      success: false,
    });
  }
};
