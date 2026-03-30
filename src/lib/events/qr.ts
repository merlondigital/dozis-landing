/**
 * QR token format: {registrationId}:{eventId}:{userId}:{hmacHex}
 * Derives a dedicated HMAC key from BETTER_AUTH_SECRET using HKDF
 * to avoid key reuse across cryptographic contexts (auth vs QR signing)
 * Web Crypto API works in both Workers and Node.js runtimes
 */

const QR_KEY_CONTEXT = "dozis-qr-token-hmac-v1";

async function getHmacKey(secret: string): Promise<CryptoKey> {
  // Import the base secret as HKDF key material
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    "HKDF",
    false,
    ["deriveKey"]
  );

  // Derive a domain-specific HMAC key using HKDF
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new TextEncoder().encode(QR_KEY_CONTEXT),
      info: new TextEncoder().encode("qr-hmac"),
    },
    baseKey,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign", "verify"]
  );
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export async function generateQrToken(
  registrationId: string,
  eventId: string,
  userId: string,
  secret: string
): Promise<string> {
  const payload = `${registrationId}:${eventId}:${userId}`;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  const hmacHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}:${hmacHex}`;
}

export async function verifyQrToken(
  token: string,
  secret: string
): Promise<{
  valid: boolean;
  registrationId?: string;
  eventId?: string;
  userId?: string;
}> {
  const parts = token.split(":");
  if (parts.length !== 4) return { valid: false };

  const [registrationId, eventId, userId, hmacHex] = parts;
  const payload = `${registrationId}:${eventId}:${userId}`;
  const key = await getHmacKey(secret);

  // Timing-safe comparison using crypto.subtle.verify()
  // This avoids === string comparison which leaks timing information
  const signatureBytes = hexToBytes(hmacHex);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes as BufferSource,
    new TextEncoder().encode(payload) as BufferSource
  );

  return valid
    ? { valid: true, registrationId, eventId, userId }
    : { valid: false };
}
