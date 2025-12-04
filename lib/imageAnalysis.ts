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
    img.decoding = "async";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load: " + src));
  });
}

function extractPalette(img: HTMLImageElement, paletteSize = 6): string[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = 84;
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  const { data } = ctx.getImageData(0, 0, width, height);

  const buckets: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 8) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const key = `${r >> 5},${g >> 5},${b >> 5}`;
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

    const duplicate = colors.some((c) => colorDistance(c, hex) < 14);
    if (duplicate) continue;

    colors.push(hex);
    if (colors.length >= paletteSize) break;
  }

  return colors.length > 0 ? colors : ["#999999"];
}

function colorDistance(a: string, b: string): number {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  return Math.hypot(c1.r - c2.r, c1.g - c2.g, c1.b - c2.b);
}

function calculateVibrance(colors: string[]): number {
  return Math.round(
    avg(
      colors.map((hex) => {
        const { r, g, b } = hexToRgb(hex);
        const diff = Math.max(r, g, b) - Math.min(r, g, b);
        return (diff / 255) * 100;
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
    avg(colors.map((hex) => hexToHsl(hex).s * 100))
  );
}

function detectCompositionFromName(src: string): string {
  const name = src.toLowerCase();

  if (name.includes("pet") || name.includes("dog") || name.includes("petshop"))
    return "Petshop";

  if (name.includes("advog") || name.includes("jurid") || name.includes("debora"))
    return "Corporativo";

  if (
    name.includes("ideal") ||
    name.includes("farm") ||
    name.includes("medic") ||
    name.includes("odonto") ||
    name.includes("lg_odonto")
  )
    return "Farmacêutico";

  if (
    name.includes("fitness") ||
    name.includes("rs_fitness") ||
    name.includes("academia") ||
    name.includes("treino")
  )
    return "Fitness";

  if (name.includes("faepi") || name.includes("enem") || name.includes("curso"))
    return "Educacional";

  if (
    name.includes("vaquej") ||
    name.includes("bloco") ||
    name.includes("saojoao") ||
    name.includes("sorteio") ||
    name.includes("evento")
  )
    return "Evento";

  return "Genérico";
}

function detectFocus(img: HTMLImageElement): string {
  if (img.width > img.height) return "Centro horizontal";
  if (img.height > img.width) return "Centro vertical";
  return "Centralizado";
}

function detectStyle({
  vibrance,
  brightness,
  avgSaturation,
  composition,
  palette,
}: {
  vibrance: number;
  brightness: number;
  avgSaturation: number;
  composition: string;
  palette: string[];
}): string[] {
  const styles: string[] = [];

  const hasBlack = palette.some((p) => p.includes("000000"));
  const hasWhite = palette.some((p) => p.includes("ffffff"));

  if (vibrance >= 60 && avgSaturation >= 60) styles.push("Vibrante");
  if (brightness >= 65 && avgSaturation <= 80) styles.push("Clean");
  if (brightness <= 35) styles.push("Dark");
  if (hasBlack && (hasWhite || brightness >= 55) && vibrance <= 50)
    styles.push("Minimalista");
  if (avgSaturation <= 40 && brightness >= 55) styles.push("Pastel");

  if (composition === "Petshop" && vibrance >= 55 && brightness >= 55)
    styles.push("Vibrante");

  if (composition === "Corporativo" && hasBlack) {
    styles.push("Dark");
    styles.push("Minimalista");
  }

  if (composition === "Farmacêutico" && brightness >= 60)
    styles.push("Clean");

  return styles.length ? Array.from(new Set(styles)) : ["Neutro"];
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
  tags.push(`COR DOMINANTE: ${palette[0].toUpperCase()}`);

  if (brightness >= 65 && vibrance <= 40) tags.push("SUAVE");
  if (brightness <= 40 && vibrance >= 50) tags.push("DRAMÁTICO");

  return tags;
}

function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;

    h /= 6;
  }

  return { h, s, l };
}
