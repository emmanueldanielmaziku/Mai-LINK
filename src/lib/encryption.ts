const ENCRYPTION_KEY = Bun.env.ENCRYPTION_KEY!;
const ALGORITHM = "aes-256-cbc";

// Encrypt
export async function encrypt(text: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENCRYPTION_KEY),
    { name: "AES-CBC" },
    false,
    ["encrypt"],
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    new TextEncoder().encode(text),
  );

  const ivHex = Buffer.from(iv).toString("hex");
  const encryptedHex = Buffer.from(encrypted).toString("hex");

  return `${ivHex}:${encryptedHex}`;
}

// Decrypt
export async function decrypt(cipherText: string): Promise<string> {
  const [ivHex, encryptedHex] = cipherText.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENCRYPTION_KEY),
    { name: "AES-CBC" },
    false,
    ["decrypt"],
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    encrypted,
  );

  return new TextDecoder().decode(decrypted);
}
