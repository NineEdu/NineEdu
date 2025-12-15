import admin from "firebase-admin";
import { createRequire } from "module"; // 1. Import thư viện module của Node

// 2. Tạo hàm require (vì ES Module không có sẵn require)
const require = createRequire(import.meta.url);

// 3. Load file JSON bằng require (Sửa đường dẫn thành ./ nếu file nằm cùng thư mục)
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
