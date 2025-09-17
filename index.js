import { config } from 'dotenv';
config();
import express from 'express';
import connectDB from './config/db.js';
const app = express();

// Database Connection
connectDB();


// Basic Route
app.get('/', (req, res)=>{
    res.send('App is running')
})


// Server Start
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server Running on http://localhost:${port}`)
})