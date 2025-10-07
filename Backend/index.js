const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config();
const PORT = process.env.PORT;


app.get('/', (req,res)=>{
    return res.status(200).json({
        msg:"Backend is runing fine"
    })
})

app.listen(PORT, ()=>{
    console.log(`Serveris running on PORT ${PORT}`);
    
})