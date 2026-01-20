import express from "express";
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

console.log("JWT_ACCESS_SECRET =", process.env.JWT_ACCESS_SECRET);
console.log("JWT_REFRESH_SECRET =", process.env.JWT_REFRESH_SECRET);

app.get("/", (_req, res) => {
  res.send("API running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
