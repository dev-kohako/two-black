"use client";

export function createImageWorker() {
  const workerCode = `
    self.onmessage = async (event) => {
      const { id, src } = event.data;

      try {
        const blob = await fetch(src).then(r => {
          if (!r.ok) throw new Error("Falha ao carregar imagem: " + src);
          return r.blob();
        });

        const bitmap = await createImageBitmap(blob);

        const analysis = analyzeBitmap(bitmap);

        self.postMessage({ id, result: analysis, success: true });

      } catch (error) {
        self.postMessage({
          id,
          error: error?.message ?? "Erro desconhecido no worker",
          success: false
        });
      }
    };

    function analyzeBitmap(bitmap) {
      const { palette, brightness, vibrance } = extractPaletteAndMetrics(bitmap);

      const primary = palette[0] ?? "#999999";
      const secondary = palette[1] ?? primary;

      return {
        palette,
        primary,
        secondary,
        vibrance,
        brightness,
        style: ["Auto"],
        composition: "Genérico",
        focus: bitmap.width >= bitmap.height ? "Centro horizontal" : "Centro vertical",
        tags: []
      };
    }

    function extractPaletteAndMetrics(bitmap) {
      const size = 96;
      const scale = Math.min(size / bitmap.width, size / bitmap.height, 1);
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));

      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bitmap, 0, 0, w, h);

      const { data } = ctx.getImageData(0, 0, w, h);

      const buckets = {};
      let brightnessSum = 0;
      let vibranceSum = 0;
      const totalPixels = data.length / 4;

      for (let i = 0; i < data.length; i += 8) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const key = (r >> 5) + "," + (g >> 5) + "," + (b >> 5);
        buckets[key] = (buckets[key] || 0) + 1;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        brightnessSum += (0.299 * r + 0.587 * g + 0.114 * b);
        vibranceSum += (max - min);
      }

      const sorted = Object.entries(buckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 18);

      const colors = sorted.map(([key]) => {
        const [br, bg, bb] = key.split(",").map(Number);
        return rgbToHex(br * 32 + 16, bg * 32 + 16, bb * 32 + 16);
      });

      const palette = uniqueColors(colors).slice(0, 6);

      const avgBrightness = Math.round((brightnessSum / totalPixels) / 2.55);
      const avgVibrance = Math.round((vibranceSum / totalPixels) / 2.55);

      return {
        palette,
        brightness: avgBrightness,
        vibrance: avgVibrance,
      };
    }

    function rgbToHex(r, g, b) {
      return "#" + [r, g, b]
        .map(v => v.toString(16).padStart(2, "0"))
        .join("");
    }

    function uniqueColors(colors) {
      const result = [];
      for (const c of colors) {
        if (!result.some(rc => colorDistance(rc, c) < 14)) {
          result.push(c);
        }
      }
      return result;
    }

    function colorDistance(a, b) {
      const ar = parseInt(a.slice(1, 3), 16);
      const ag = parseInt(a.slice(3, 5), 16);
      const ab = parseInt(a.slice(5, 7), 16);

      const br = parseInt(b.slice(1, 3), 16);
      const bg = parseInt(b.slice(3, 5), 16);
      const bb = parseInt(b.slice(5, 7), 16);

      return Math.hypot(ar - br, ag - bg, ab - bb);
    }
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  const workerUrl = URL.createObjectURL(blob);

  return new Worker(workerUrl);
}
