import { generateContrastTextColour } from "./generateContrastTextColour";
import { setDocumentProperty } from "./setDocumentProperty";

type HSLColor = [number, number, number];

function hexToHSL(hex: string): HSLColor {
  // Convert hex to RGB first
  let r: number = parseInt(hex.slice(1, 3), 16) / 255;
  let g: number = parseInt(hex.slice(3, 5), 16) / 255;
  let b: number = parseInt(hex.slice(5, 7), 16) / 255;

  // Find greatest and smallest channel values
  let cmin: number = Math.min(r, g, b);
  let cmax: number = Math.max(r, g, b);
  let delta: number = cmax - cmin;
  let h: number = 0;
  let s: number = 0;
  let l: number = 0;

  // Calculate hue
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [h, s * 100, l * 100];
}

function HSLToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  let c: number = (1 - Math.abs(2 * l - 1)) * s;
  let x: number = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m: number = l - c / 2;
  let r: number = 0,
    g: number = 0,
    b: number = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

export function generateColourScale(
  baseColour: string,
  type: string = "primary",
): void {
  const [hue, saturation, baseLightness] = hexToHSL(baseColour);

  // Set the base color
  setDocumentProperty(`colour-${type}`, baseColour);
  const baseTextColour = generateContrastTextColour(baseColour);
  setDocumentProperty(`colour-${type}-text`, baseTextColour);

  // Generate increasingly lighter shades
  for (let i = 10; i <= 90; i += 10) {
    const lightnessIncrease = (i / 90) * 30;
    const newLightness = Math.min(100, baseLightness + lightnessIncrease);
    const newColour = HSLToHex(
      hue,
      Math.max(0, saturation - i / 2),
      newLightness,
    );

    setDocumentProperty(`colour-${type}-${i}`, newColour);
    const textColour = generateContrastTextColour(newColour);
    setDocumentProperty(`colour-${type}-${i}-text`, textColour);
  }
}
