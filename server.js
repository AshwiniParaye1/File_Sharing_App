const express = require("express")
// import PostFiles from "./frontend/pages/postFiles";

const cors = require("cors")

const path = require("path")

require("dotenv").config()

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())

app.use(express.static("public"))

app.use(express.json())

const connectDB = require("./config/db")

connectDB()

//Routes
app.use("/api/files", require("./routes/files"))

app.use("/files/download", require("./routes/download"))

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
