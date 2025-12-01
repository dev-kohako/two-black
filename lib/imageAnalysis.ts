export interface ImageAnalysis {
  palette: string[];
  primary: string;
  secondary: string;
  vibrance: number;
  brightness: number;
  style: string[];
  composition: string;
  focus: string;
  tags: string[];
}

export async function analyzeImage(src: string): Promise<ImageAnalysis> {
  const img = await loadImage(src);

  const palette = extractPalette(img, 6);
  const primary = palette[0];
  const secondary = palette[1] ?? primary;

  const vibrance = calculateVibrance(palette);
  const brightness = calculateBrightness(palette);
  const avgSaturation = calculateAverageSaturation(palette);

  const composition = detectCompositionFromName(src);
  const focus = detectFocus(img);
  const style = detectStyle({
    vibrance,
    brightness,
    avgSaturation,
    composition,
    palette,
  });

  const tags = generateTags({
    palette,
    style,
    composition,
    brightness,
    vibrance,
  });

  return {
    palette,
    primary,
    secondary,
    vibrance,
    brightness,
    style,
    composition,
    focus,
    tags,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

function extractPalette(img: HTMLImageElement, paletteSize = 6): string[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = 80;
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const { data } = ctx.getImageData(0, 0, width, height);

  const buckets: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 4 * 2) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const bucketR = Math.floor(r / 32);
    const bucketG = Math.floor(g / 32);
    const bucketB = Math.floor(b / 32);

    const key = `${bucketR},${bucketG},${bucketB}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }

  const sortedBuckets = Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, paletteSize * 3);

  const colors: string[] = [];

  for (const [key] of sortedBuckets) {
    const [br, bg, bb] = key.split(",").map((v) => parseInt(v, 10));
    const r = br * 32 + 16;
    const g = bg * 32 + 16;
    const b = bb * 32 + 16;

    const hex = rgbToHex(r, g, b);

    const { s } = hexToHsl(hex);
    if (s < 0.12) continue;

    const isDuplicate = colors.some((c) => colorDistance(c, hex) < 12);
    if (isDuplicate) continue;

    colors.push(hex);
    if (colors.length >= paletteSize) break;
  }

  if (colors.length === 0) {
    return ["#999999"];
  }

  return colors;
}

function colorDistance(hex1: string, hex2: string): number {
  const { r: r1, g: g1, b: b1 } = hexToRgb(hex1);
  const { r: r2, g: g2, b: b2 } = hexToRgb(hex2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function calculateVibrance(colors: string[]): number {
  return Math.round(
    avg(
      colors.map((hex) => {
        const { r, g, b } = hexToRgb(hex);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return ((max - min) / 255) * 100;
      })
    )
  );
}

function calculateBrightness(colors: string[]): number {
  return Math.round(
    avg(
      colors.map((hex) => {
        const { r, g, b } = hexToRgb(hex);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 2.55;
      })
    )
  );
}

function calculateAverageSaturation(colors: string[]): number {
  return Math.round(
    avg(
      colors.map((hex) => {
        const { s } = hexToHsl(hex);
        return s * 100;
      })
    )
  );
}

function detectCompositionFromName(src: string): string {
  const name = src.toLowerCase();

  if (name.includes("pet") || name.includes("dog") || name.includes("petshop")) {
    return "Petshop";
  }

  if (name.includes("advog") || name.includes("jurid") || name.includes("debora")) {
    return "Corporativo";
  }

  if (
    name.includes("ideal") ||
    name.includes("farm") ||
    name.includes("medic") ||
    name.includes("odonto") ||
    name.includes("lg_odonto")
  ) {
    return "Farmacêutico";
  }

  if (
    name.includes("fitness") ||
    name.includes("rs_fitness") ||
    name.includes("academia") ||
    name.includes("treino")
  ) {
    return "Fitness";
  }

  if (name.includes("faepi") || name.includes("enem") || name.includes("curso")) {
    return "Educacional";
  }

  if (
    name.includes("vaquej") ||
    name.includes("bloco") ||
    name.includes("saojoao") ||
    name.includes("sorteio") ||
    name.includes("evento")
  ) {
    return "Evento";
  }

  return "Genérico";
}

function detectFocus(img: HTMLImageElement): string {
  if (img.width > img.height) return "Centro horizontal";
  if (img.height > img.width) return "Centro vertical";
  return "Centralizado";
}

function detectStyle(params: {
  vibrance: number;
  brightness: number;
  avgSaturation: number;
  composition: string;
  palette: string[];
}): string[] {
  const { vibrance, brightness, avgSaturation, composition, palette } = params;

  const styles: string[] = [];

  const hasNearBlack = palette.some((p) => p.toLowerCase().includes("000000"));
  const hasNearWhite = palette.some((p) => p.toLowerCase().includes("ffffff"));

  if (vibrance >= 60 && avgSaturation >= 60) {
    styles.push("Vibrante");
  }

  if (brightness >= 65 && avgSaturation <= 80) {
    styles.push("Clean");
  }

  if (brightness <= 35) {
    styles.push("Dark");
  }

  if (hasNearBlack && (hasNearWhite || brightness >= 55) && vibrance <= 50) {
    styles.push("Minimalista");
  }

  if (avgSaturation <= 40 && brightness >= 55) {
    styles.push("Pastel");
  }

  if (composition === "Petshop" && vibrance >= 55 && brightness >= 55) {
    if (!styles.includes("Vibrante")) styles.push("Vibrante");
  }

  if (composition === "Corporativo" && hasNearBlack) {
    if (!styles.includes("Dark")) styles.push("Dark");
    if (!styles.includes("Minimalista")) styles.push("Minimalista");
  }

  if (composition === "Farmacêutico" && brightness >= 60) {
    if (!styles.includes("Clean")) styles.push("Clean");
  }

  if (styles.length === 0) {
    styles.push("Neutro");
  }

  return Array.from(new Set(styles));
}

function generateTags({
  palette,
  style,
  composition,
  brightness,
  vibrance,
}: {
  palette: string[];
  style: string[];
  composition: string;
  brightness: number;
  vibrance: number;
}): string[] {
  const tags: string[] = [];

  style.forEach((s) => tags.push(s.toUpperCase()));

  tags.push(composition.toUpperCase());

  if (palette[0]) tags.push(`COR DOMINANTE: ${palette[0].toUpperCase()}`);

  if (brightness >= 65 && vibrance <= 40) tags.push("SUAVE");
  if (brightness <= 40 && vibrance >= 50) tags.push("DRAMÁTICO");

  return tags;
}

function avg(arr: number[]) {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  let rN = r / 255;
  let gN = g / 255;
  let bN = b / 255;

  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rN:
        h = (gN - bN) / d + (gN < bN ? 6 : 0);
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      case bN:
        h = (rN - gN) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}
