import { encryptId } from "./encrypt";

export function generateQRCode(id: string): string {
  const encryptedHash = encryptId(id);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(encryptedHash)}`;
};