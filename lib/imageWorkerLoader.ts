"use client";

export function createImageWorker() {
  const workerCode = `
    function rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function getBrightness(r, g, b) {
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    function analyzeImageData(data, width, height, filename) {
      const SAMPLE_STEP = 5;    
      const MIN_ALPHA = 40;          
      const BUCKET_SIZE = 6;        

      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      const buckets = new Map();

      for (let y = 0; y < height; y += SAMPLE_STEP) {
        for (let x = 0; x < width; x += SAMPLE_STEP) {
          const i = (y * width + x) * 4;
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];

          if (a < MIN_ALPHA) continue;

          count++;
          rSum += r;
          gSum += g;
          bSum += b;

          const key = ((r >> 2) << 12) | ((g >> 2) << 6) | (b >> 2);
          buckets.set(key, (buckets.get(key) || 0) + 1);
        }
      }

      if (count === 0) {
        return {
          palette: ["#888888"],
          primary: "#888888",
          secondary: "#666666",
          brightness: 50,
          isDark: true,
          style: ["Unknown", "Low contrast"],
          composition: "Genérico",
          tags: ["UNKNOWN"]
        };
      }

      const palette = [...buckets.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([key]) => {
          const r = (key >> 12) << 2;
          const g = ((key >> 6) & 63) << 2;
          const b = (key & 63) << 2;
          return rgbToHex(r, g, b);
        });

      const avgBrightness = getBrightness(rSum / count, gSum / count, bSum / count);
      const isDark = avgBrightness < 85;

      const style = [];
      if (isDark) style.push("Dark");
      if (avgBrightness > 170) style.push("Bright");
      if (palette.length <= 3) style.push("Minimalista");
      else if (palette.length >= 6) style.push("Colorido");
      style.push(isDark ? "Elegante" : "Moderno");

      const name = (filename || "").toLowerCase().split(/[/_.-]/);
      let composition = "Genérico";
      
      if (name.some(t => /pet|dog|cat|animal/.test(t))) composition = "Petshop";
      else if (name.some(t => /adv|advogado|jur|law|escritorio/.test(t))) composition = "Corporativo";
      else if (name.some(t => /fit|gym|academia|muscle|train/.test(t))) composition = "Fitness";
      else if (name.some(t => /food|comida|burger|pizza|cafe/.test(t))) composition = "Alimentação";
      else if (name.some(t => /beauty|salao|maqui|hair|nail/.test(t))) composition = "Beleza";

      return {
        palette,
        primary: palette[0] || "#888888",
        secondary: palette[1] || palette[0] || "#666666",
        brightness: Math.round(avgBrightness),
        isDark,
        style,
        composition,
        focus: "Centralizado",
        tags: [...new Set([
          isDark ? "DARK" : "LIGHT",
          composition.toUpperCase(),
          ...style.map(s => s.toUpperCase())
        ])]
      };
    }

    self.onmessage = async function(e) {
      const { id, src } = e.data;
      if (!id || !src) return;

      try {
        const response = await fetch(src, { 
          cache: "force-cache", 
          mode: "cors" 
        });

        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}\`);
        }

        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob, {
          resizeQuality: "high",
          premultiplyAlpha: "premultiply"
        });

        const TARGET_SIZE = 96;
        const canvas = new OffscreenCanvas(TARGET_SIZE, TARGET_SIZE);
        const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

        ctx.drawImage(bitmap, 0, 0, TARGET_SIZE, TARGET_SIZE);
        const imageData = ctx.getImageData(0, 0, TARGET_SIZE, TARGET_SIZE);

        const result = analyzeImageData(
          imageData.data,
          TARGET_SIZE,
          TARGET_SIZE,
          src.split("/").pop() || ""
        );

        self.postMessage({ id, result, success: true });

        bitmap.close();
      } catch (err) {
        self.postMessage({
          id,
          success: false,
          error: err.message || "Erro desconhecido na análise"
        });
      }
    };

    self.postMessage({ type: "ready" });
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  const worker = new Worker(URL.createObjectURL(blob));
  return worker;
}