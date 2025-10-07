const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config();
const PORT = process.env.PORT;
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.get('/', (req,res)=>{
    return res.status(200).json({
        msg:"Backend is running fine"
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
    
})