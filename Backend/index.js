const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config();
const PORT = process.env.PORT;
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')


app.use(cors({
  origin: "http://localhost:5173",  //Vite dev URL
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())


const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes')
const patientRoutes = require('./routes/patientRoutes')

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes)



const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
};

startServer();

app.get('/', (req,res)=>{
    return res.status(200).json({
        msg:"Backend is running fine"
    })
})
