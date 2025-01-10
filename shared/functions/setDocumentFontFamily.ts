import { FontStyles } from "../types";

export function setDocumentFontFamily(fontStyle: FontStyles) {
  switch (fontStyle) {
    case FontStyles.SERIF:
      document.documentElement.style.setProperty(
        "--font-family",
        "'EB Garamond', serif",
      );
      break;
    case FontStyles.SANS_SERIF:
      document.documentElement.style.setProperty(
        "--font-family",
        "'Noto Sans'",
      );
      break;
    case FontStyles.MONOSPACE:
      document.documentElement.style.setProperty(
        "--font-family",
        "'JetBrains Mono'",
      );
      break;
    case FontStyles.CURSIVE:
      document.documentElement.style.setProperty(
        "--font-family",
        "'Coming Soon'",
      );
      break;
    case FontStyles.FANTASY:
      document.documentElement.style.setProperty("--font-family", "'Grenze'");
      break;
  }
}
