export const replaceExtensionWithJpeg = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) return `${filename}.jpeg`;
  return `${filename.slice(0, lastDotIndex)}.jpeg`;
};
