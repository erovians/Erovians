import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey =
  process.env.GSTIN_SECRET_KEY || "12345678901234567890123456789012"; // must be 32 bytes

// Encrypt GSTIN
export const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // unique initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex"); // save iv + encrypted data
};

// Decrypt GSTIN (useful when you need original GSTIN later)
export const decrypt = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
