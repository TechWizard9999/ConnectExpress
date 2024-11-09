const express = require('express')
const app = express()
const dotenv = require('dotenv')
const { dbConnect } = require('./config/database')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const stationRoute = require('./routes/station')

dotenv.config()
dbConnect()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/v1/station", stationRoute);


app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running....",
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})    
