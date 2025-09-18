import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
const app = express();

// Import All Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";


// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Basic Route
app.get('/', (req, res)=>{
    res.send('App is running');
})

// Main Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);


// Error handler (fallback)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Server Start
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server Running on http://localhost:${port}`)
})