import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoute from "./routes/authRoute.js";
import courseRoute from "./routes/courseRoute.js";
import lessonRoute from "./routes/lessonRoute.js";
import enrollmentRoute from "./routes/enrollmentRoute.js";
import quizRoute from "./routes/quizRoute.js";
import connectDB from "./libs/db.js";
import aiRoute from "./routes/aiRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import userRoute from "./routes/userRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./configs/swagger.js";

const app = express();
const PORT = process.env.PORT || 5002;

// Support multiple origins for different environments
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

// Add the backend URL for Swagger UI
const backendUrl = `http://localhost:${PORT}`;
if (!allowedOrigins.includes(backendUrl)) {
  allowedOrigins.push(backendUrl);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to NineEdu App." });
});

// public routes
app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/lessons", lessonRoute);
app.use("/api/enroll", enrollmentRoute);
app.use("/api/quizzes", quizRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/users", userRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/ai", aiRoute);
app.use("/api/conversations", conversationRoutes);
app.use("/api/certificates", certificateRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
