export const base64ToBlob = (base64: string): Blob => {
  const [header, data] = base64.split(",");
  const mimeType = header.match(/data:(.*?);/)?.[1] || "";
  const byteString = atob(data);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mimeType });
};
