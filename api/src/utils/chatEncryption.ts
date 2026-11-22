import crypto from 'crypto';
import { env } from '../config/env';

/**
 * Returns a strictly 32-byte key derived from CHAT_ENCRYPTION_KEY using SHA-256
 */
function getKey(): Buffer {
  const rawKey = env.CHAT_ENCRYPTION_KEY || 'gyde_default_chat_encryption_key_32bytes!';
  return crypto.createHash('sha256').update(rawKey).digest();
}

/**
 * Encrypts a string using AES-256-GCM
 */
export function encryptText(plainText: string): { ciphertext: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * Decrypts a string using AES-256-GCM
 */
export function decryptText(ciphertext: string, ivHex: string, authTagHex: string): string {
  try {
    if (!ciphertext) return '';
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return '[Message unavailable]';
  }
}

/**
 * Encrypts a binary buffer using AES-256-GCM
 */
export function encryptBuffer(buffer: Buffer): { encryptedBuffer: Buffer; iv: string; authTag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedBuffer: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * Decrypts a binary buffer using AES-256-GCM
 */
export function decryptBuffer(encryptedBuffer: Buffer, ivHex: string, authTagHex: string): Buffer {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}
