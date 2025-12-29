import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Support both environment variable (cloud deployment) and local file
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Parse JSON from environment variable (for Docker/cloud deployment)
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", error);
    process.exit(1);
  }
} else {
  // Load from local file (for local development)
  console.log("Loading from serviceAccountKey.json file");
  serviceAccount = require("./serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
