import CryptoJS from 'crypto-js';

// Use a secure key derivation function with a salt
const deriveKey = (userKey: string, salt: string): string => {
  return CryptoJS.PBKDF2(userKey, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
};

// Generate a random salt
const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};

export const encrypt = (text: string, userKey: string = ''): string => {
  const salt = generateSalt();
  const key = deriveKey(userKey || import.meta.env.VITE_ENCRYPTION_KEY || 'fallback-key', salt);
  
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Combine salt and encrypted data
  return `${salt}:${encrypted.toString()}`;
};

export const decrypt = (ciphertext: string, userKey: string = ''): string => {
  try {
    const [salt, encryptedData] = ciphertext.split(':');
    const key = deriveKey(userKey || import.meta.env.VITE_ENCRYPTION_KEY || 'fallback-key', salt);

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed');
    return '';
  }
};