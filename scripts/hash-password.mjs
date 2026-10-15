// PANEL_PASSWORD_HASH üretici.
//
// Kullanım:
//   node scripts/hash-password.mjs "güçlü-parolam"
//
// Çıktıyı Vercel ortam değişkeni olarak ekleyin:
//   PANEL_PASSWORD_HASH=scrypt$....
import { hashPassword } from "../api/_lib/password.js";

const password = process.argv[2];

if (!password) {
  console.error('Kullanım: node scripts/hash-password.mjs "parolanız"');
  process.exit(1);
}

console.log(hashPassword(password));
