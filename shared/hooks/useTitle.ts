import { useEffect, useState } from "react";

/**
 * Allows access to modifying the document title
 */
export function useTitle() {
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  useEffect(() => {
    console.log(documentTitle);
    if (documentTitle) {
      document.title = `${documentTitle}`;
    } else {
      document.title = `Player | Drystone`;
    }
  }, [documentTitle]);

  const setTitle = (title: string) => {
    setDocumentTitle(title);
  };

  return { setTitle, title: documentTitle };
}
