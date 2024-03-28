const crypto = require("crypto");

// Encrypt function
function encrypt(text, key, iv) {
  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(key, "base64"),
      Buffer.from(iv, "base64")
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

// Decrypt function
function decrypt(encryptedText, key, iv) {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key, "base64"),
      Buffer.from(iv, "base64")
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}

module.exports = {
  encrypt,
  decrypt,
};
