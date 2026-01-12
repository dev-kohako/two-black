type HexColor = `#${string}`;

export interface ImageAnalysis {
  palette: HexColor[];
  primary: HexColor;
  secondary: HexColor;
  vibrance: number;
  brightness: number;
  style: string[];
  composition: string;
  focus: "horizontal" | "vertical" | "square";
  tags: string[];
}

interface AnalysisOptions {
  maxSize?: number;
  paletteSize?: number;
  category?: string;
}

export async function analyzeImage(
  src: string,
  options: AnalysisOptions = {}
): Promise<ImageAnalysis> {
  const { maxSize = 96, paletteSize = 6, category } = options;

  const img = await loadImage(src);
  const palette = await extractBetterPalette(img, paletteSize, maxSize);

  const primary = palette[0] ?? ("#999999" as HexColor);
  const secondary = palette[1] ?? primary;

  const metrics = calculateColorMetrics(palette);

  const composition = category ?? detectCompositionFromName(src);
  const focus = detectFocusType(img);

  const style = detectStyleV2({ ...metrics, composition, palette });
  const tags = generateTagsV2({ ...metrics, style, composition, palette });

  return {
    palette,
    primary,
    secondary,
    vibrance: metrics.vibrance,
    brightness: metrics.brightness,
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

async function extractBetterPalette(
  img: HTMLImageElement,
  count: number,
  maxSize: number
): Promise<HexColor[]> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const { data, width, height } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  const pixels: [number, number, number][] = [];

  const step = Math.max(1, Math.floor(Math.sqrt(data.length / 4 / 2500)));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      if (r > 235 && g > 235 && b > 235) continue;
      pixels.push([r, g, b]);
    }
  }

  const buckets: Record<
    string,
    { count: number; r: number; g: number; b: number }
  > = {};

  for (const [r, g, b] of pixels) {
    const key = `${r >> 2},${g >> 2},${b >> 2}`;
    if (!buckets[key]) buckets[key] = { count: 0, r: 0, g: 0, b: 0 };
    const bucket = buckets[key];
    bucket.count++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
  }

  const sorted = Object.values(buckets)
    .sort((a, b) => b.count - a.count)
    .slice(0, count * 4);

  const colors: HexColor[] = [];

  for (const { count, r, g, b } of sorted) {
    const avgR = Math.round(r / count);
    const avgG = Math.round(g / count);
    const avgB = Math.round(b / count);

    const hex = rgbToHex(avgR, avgG, avgB) as HexColor;
    const { s } = hexToHsl(hex);

    if (s < 0.08) continue;

    if (colors.some((c) => colorDeltaE(c, hex) < 12)) continue;

    colors.push(hex);
    if (colors.length >= count) break;
  }

  return colors.length > 0 ? colors : ["#888888" as HexColor];
}

function colorDeltaE(a: string, b: string): number {
  const labA = rgbToLab(hexToRgb(a));
  const labB = rgbToLab(hexToRgb(b));
  return Math.hypot(labA.l - labB.l, labA.a - labB.a, labA.b - labB.b);
}

function rgbToLab({ r, g, b }: { r: number; g: number; b: number }): {
  l: number;
  a: number;
  b: number;
} {
  r /= 255;
  g /= 255;
  b /= 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return {
    l: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

function calculateColorMetrics(colors: HexColor[]): {
  vibrance: number;
  brightness: number;
  avgSaturation: number;
} {
  if (!colors.length) {
    return { vibrance: 50, brightness: 50, avgSaturation: 50 };
  }

  const vibrances = colors.map((hex) => {
    const { r, g, b } = hexToRgb(hex);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return ((max - min) / 255) * 100;
  });

  const brightnesses = colors.map((hex) => {
    const { r, g, b } = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 2.55;
  });

  const saturations = colors.map((hex) => hexToHsl(hex).s * 100);

  return {
    vibrance: Math.round(avg(vibrances)),
    brightness: Math.round(avg(brightnesses)),
    avgSaturation: Math.round(avg(saturations)),
  };
}

function detectCompositionFromName(src: string): string {
  const name = src.toLowerCase();

  if (name.includes("pet") || name.includes("dog") || name.includes("petshop"))
    return "Petshop";

  if (
    name.includes("advog") ||
    name.includes("jurid") ||
    name.includes("debora")
  )
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

function detectFocusType(
  img: HTMLImageElement
): "horizontal" | "vertical" | "square" {
  if (img.width > img.height * 1.2) return "horizontal";
  if (img.height > img.width * 1.2) return "vertical";
  return "square";
}

function detectStyleV2({
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
  palette: HexColor[];
}): string[] {
  const styles = new Set<string>();

  const hasBlack = palette.some((p) => colorDeltaE(p, "#000000") < 20);
  const hasWhite = palette.some((p) => colorDeltaE(p, "#ffffff") < 20);

  if (vibrance >= 60 && avgSaturation >= 60) styles.add("Vibrante");
  if (brightness >= 65 && avgSaturation <= 80) styles.add("Clean");
  if (brightness <= 35) styles.add("Dark");
  if (hasBlack && (hasWhite || brightness >= 55) && vibrance <= 50)
    styles.add("Minimalista");
  if (avgSaturation <= 40 && brightness >= 55) styles.add("Pastel");

  if (composition === "Petshop" && vibrance >= 55 && brightness >= 55)
    styles.add("Vibrante");
  if (composition === "Corporativo" && hasBlack) {
    styles.add("Dark");
    styles.add("Minimalista");
  }
  if (composition === "Farmacêutico" && brightness >= 60) styles.add("Clean");

  return styles.size ? Array.from(styles) : ["Neutro"];
}

function generateTagsV2({
  palette,
  style,
  composition,
  brightness,
  vibrance,
}: {
  palette: HexColor[];
  style: string[];
  composition: string;
  brightness: number;
  vibrance: number;
}): string[] {
  const tags = new Set<string>();

  style.forEach((s) => tags.add(s.toUpperCase()));
  tags.add(composition.toUpperCase());
  if (palette[0]) tags.add(`COR DOMINANTE: ${palette[0].toUpperCase()}`);

  if (brightness >= 65 && vibrance <= 40) tags.add("SUAVE");
  if (brightness <= 40 && vibrance >= 50) tags.add("DRAMÁTICO");

  return Array.from(tags);
}

function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
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
