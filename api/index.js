import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app, server } from "./src/lib/socket.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({limit: '4mb'}));
app.use(cookieParser());

// CORS configuration - Update this section
// const allowedOrigins = [
//   process.env.FRONTEND_URL,  // This is the key environment variable
//   'http://localhost:5173',
//   'http://localhost:3000'
// ];

// app.use(
//   cors({
//     origin: function(origin, callback) {
//       // Allow requests with no origin (mobile apps, Postman)
//       if (!origin) return callback(null, true);
      
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.log("Blocked origin:", origin);
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
//   })
// );

app.use(
  cors({
    origin: true,          // Allow all origins
    credentials: true,     // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);
// API routes
app.use("/api/status", (req, res) => res.json({ status: "Server is live" }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Connect to database and start server
try {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
