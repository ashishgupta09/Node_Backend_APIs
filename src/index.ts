import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// DB
connectDB();

console.log("JWT_ACCESS_SECRET =", process.env.JWT_ACCESS_SECRET);
console.log("JWT_REFRESH_SECRET =", process.env.JWT_REFRESH_SECRET);

// Health check
app.get("/", (_req, res) => {
  res.send("API running...");
});

// Routes
console.log("📍 Mounting /api/auth routes...");
app.use("/api/auth", authRoutes);
console.log("📍 Mounting /api/bookings routes...");
app.use("/api/bookings", bookingRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  console.warn(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: "Route not found", 
    path: req.path,
    method: req.method,
    availableRoutes: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/login/email/send-otp",
      "POST /api/auth/login/email/verify-otp",
      "POST /api/auth/login/phone/send-otp",
      "POST /api/auth/login/phone/verify-otp"
    ]
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("📌 Available endpoints:");
  console.log("   POST /api/auth/register");
  console.log("   POST /api/auth/login");
  console.log("   POST /api/auth/login/email/send-otp");
  console.log("   POST /api/auth/login/email/verify-otp");
  console.log("   POST /api/auth/login/phone/send-otp");
  console.log("   POST /api/auth/login/phone/verify-otp");
});
