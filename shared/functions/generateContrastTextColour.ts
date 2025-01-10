export function generateContrastTextColour(hexColour: string) {
  // Remove # if present
  hexColour = hexColour.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hexColour.substr(0, 2), 16) / 255;
  const g = parseInt(hexColour.substr(2, 2), 16) / 255;
  const b = parseInt(hexColour.substr(4, 2), 16) / 255;

  // Calculate relative luminance
  const luminance =
    0.2126 * adjustGamma(r) + 0.7152 * adjustGamma(g) + 0.0722 * adjustGamma(b);

  // Return black or white based on luminance
  return luminance > 0.4 ? "#121217" : "#ffffff";
}

function adjustGamma(color: number) {
  return color <= 0.03928
    ? color / 12.92
    : Math.pow((color + 0.055) / 1.055, 2.4);
}
