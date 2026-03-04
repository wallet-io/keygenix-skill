/**
 * SecureEncryption — ECIES over secp256k1 + AES-256-GCM + HKDF-SHA256
 * Compatible with Keygenix TEE encryption protocol (v1)
 *
 * Uses Node.js built-in crypto throughout (no ESM-only dependencies).
 */
const crypto = require("crypto");
const { secp256k1 } = require('@noble/curves/secp256k1');
const { hkdf } = require('@noble/hashes/hkdf');
const { sha256 } = require('@noble/hashes/sha256');
const { bytesToHex, hexToBytes } = require('@noble/hashes/utils');

class SecureEncryption {
  constructor() {
    this.version = 1;
  }

  encrypt(plaintext, publicKeyHex, ephemeralPrivateKeyHex = undefined) {
    if (typeof plaintext !== 'string' || plaintext.length === 0)
      throw new Error('Plaintext must be non-empty string');
    if (typeof publicKeyHex !== 'string' || !/^[0-9a-f]+$/i.test(publicKeyHex))
      throw new Error('Invalid public key format');

    const ephemeralPrivKeyBytes = ephemeralPrivateKeyHex
      ? hexToBytes(ephemeralPrivateKeyHex)
      : secp256k1.utils.randomSecretKey();

    const secret = secp256k1.getSharedSecret(ephemeralPrivKeyBytes, hexToBytes(publicKeyHex)).slice(1);
    const salt = crypto.randomBytes(32);
    const key = Buffer.from(hkdf(sha256, secret, salt, 'encryption-key', 32));
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return JSON.stringify({
      v: this.version,
      epk: bytesToHex(secp256k1.getPublicKey(ephemeralPrivKeyBytes)),
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      tag: authTag.toString('hex'),
      data: encrypted,
    });
  }

  decrypt(encryptedData, privateKeyHex) {
    const data = typeof encryptedData === 'string' ? JSON.parse(encryptedData) : encryptedData;
    if (data.v !== this.version) throw new Error(`Unsupported version: ${data.v}`);
    for (const field of ['epk', 'salt', 'iv', 'tag', 'data']) {
      if (!data[field]) throw new Error(`Missing field: ${field}`);
    }

    const secret = secp256k1.getSharedSecret(hexToBytes(privateKeyHex), hexToBytes(data.epk)).slice(1);
    const key = Buffer.from(hkdf(sha256, secret, hexToBytes(data.salt), 'encryption-key', 32));
    const iv = Buffer.from(data.iv, 'hex');
    const tag = Buffer.from(data.tag, 'hex');
    const ciphertext = Buffer.from(data.data, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(ciphertext, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = SecureEncryption;
