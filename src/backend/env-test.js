import dotenv from "dotenv";
dotenv.config();

console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Password:", process.env.DB_PASS);
console.log("DB Name:", process.env.DB_NAME);
