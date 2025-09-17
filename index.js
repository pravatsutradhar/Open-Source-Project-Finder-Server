const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// Basic Route
app.get('/', (req, res)=>{
    res.send({
        success: true,
        data : "App is running on 5000"
    })
})


// Server Start
app.listen(port, ()=>{
    console.log(`Server Running on http://localhost:${port}`)
})