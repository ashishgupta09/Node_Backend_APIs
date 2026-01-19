import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bookingRoutes from "./routes/booking.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/bookings", bookingRoutes);

app.get("/", (_req, res) => {
  res.send("API running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
