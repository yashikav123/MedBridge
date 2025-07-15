import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();
connectDB();
connectCloudinary();

const app = express();
const port = process.env.PORT || 5000;

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});


// Routes
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);
app.get("/test", (req, res) => res.send("Test route working"));
// Base route
app.get("/", (req, res) => res.send("API is working"));

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
