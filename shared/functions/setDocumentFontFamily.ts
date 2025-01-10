import { FontStyles } from "../types";
import { setDocumentProperty } from "./setDocumentProperty";

export function setDocumentFontFamily(fontStyle: FontStyles) {
  switch (fontStyle) {
    case FontStyles.SERIF:
      setDocumentProperty("font-family", "'EB Garamond', serif");
      break;
    case FontStyles.SANS_SERIF:
      setDocumentProperty("font-family", "'Noto Sans'");
      break;
    case FontStyles.MONOSPACE:
      setDocumentProperty("font-family", "'JetBrains Mono'");
      break;
    case FontStyles.CURSIVE:
      setDocumentProperty("font-family", "'Coming Soon'");
      break;
    case FontStyles.FANTASY:
      setDocumentProperty("font-family", "'Grenze'");
      break;
  }
}
