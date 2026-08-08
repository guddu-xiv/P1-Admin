export function encodeObfuscatedDatabase(jsonStr: string): string {
  // Step 1: Base64 standard encoding
  const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
  
  // Step 2: Shift each character to make it look like foreign Sanskrit/Devanagari scripts
  const scrambled = b64.split("").map((c) => {
    const code = c.charCodeAt(0);
    return String.fromCharCode(code + 0x0900);
  }).reverse().join("");
  
  return scrambled;
}

export function decodeObfuscatedDatabase(scrambledStr: string): string {
  if (!scrambledStr) return "";
  try {
    let isScrambled = false;
    const len = scrambledStr.length;
    for (let i = 0; i < Math.min(len, 100); i++) {
      if (scrambledStr.charCodeAt(i) >= 0x0900) {
        isScrambled = true;
        break;
      }
    }
    if (isScrambled) {
      const out = new Array(len);
      for (let i = 0; i < len; i++) {
        const code = scrambledStr.charCodeAt(len - 1 - i);
        out[i] = String.fromCharCode(code >= 0x0900 ? code - 0x0900 : code);
      }
      const b64 = out.join("");
      return decodeURIComponent(escape(atob(b64)));
    } else {
      return decodeURIComponent(escape(atob(scrambledStr)));
    }
  } catch (err) {
    try {
      return decodeURIComponent(escape(atob(scrambledStr)));
    } catch (e2) {
      return scrambledStr;
    }
  }
}
