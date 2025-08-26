// Make sure you have an encryption key defined
const ENCRYPTION_KEY = "SECRETKEYOFCODEGEHAN2025";

export function encryptId(id: string): string {
  try {
    let hash = '';
    const keyLength = ENCRYPTION_KEY.length;
    // First transformation: XOR with key
    for (let i = 0; i < id.length; i++) {
      const charCode = id.charCodeAt(i);
      const keyCode = ENCRYPTION_KEY.charCodeAt(i % keyLength);
      hash += String.fromCharCode(charCode ^ keyCode);
    }
    // Second transformation: Base64 encode (works in browser)
    const base64Hash = typeof btoa !== 'undefined'
      ? btoa(hash)
      : Buffer.from(hash, 'binary').toString('base64'); // Node.js fallback
    // Third transformation: Add random padding and timestamp
    const timestamp = Date.now().toString(36);
    const padding = Math.random().toString(36).substring(2, 8);
    // Final hash format: padding + base64Hash + timestamp
    const finalHash = padding + base64Hash + timestamp;
    // Convert to hex-like format for better appearance
    let hexHash = '';
    for (let i = 0; i < finalHash.length; i++) {
      hexHash += finalHash.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hexHash.toUpperCase();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}


export function decryptId(hash: string): string {
  try {
    // 1. Convert from hex back to string
    let finalHash = '';
    for (let i = 0; i < hash.length; i += 2) {
      const hexPair = hash.substr(i, 2);
      finalHash += String.fromCharCode(parseInt(hexPair, 16));
    }

    // 2. Remove padding (first 6 chars) and timestamp (last variable length chars)
    // Since padding is always 6, we strip that.
    // For timestamp, we know it's base36 (digits+letters at the end).
    const body = finalHash.substring(6);
    const match = body.match(/^(.+?)([a-z0-9]+)$/i);
    if (!match) throw new Error("Invalid hash format");

    const base64Hash = match[1]; // the middle part is the base64
    // const timestamp = match[2]; // timestamp, if you want to validate/use it

    // 3. Decode from Base64
    const encodedString = typeof atob !== 'undefined'
      ? atob(base64Hash)
      : Buffer.from(base64Hash, 'base64').toString('binary');

    // 4. Reverse XOR with key
    let studentId = '';
    const keyLength = ENCRYPTION_KEY.length;

    for (let i = 0; i < encodedString.length; i++) {
      const charCode = encodedString.charCodeAt(i);
      const keyCode = ENCRYPTION_KEY.charCodeAt(i % keyLength);
      studentId += String.fromCharCode(charCode ^ keyCode);
    }

    return studentId;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}