const express = require("express");
// import PostFiles from "./frontend/pages/postFiles";

const cors = require("cors");

const path = require("path");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.static("public"));

app.use(express.json());

const connectDB = require("./config/db");

connectDB();

//template engine

// app.set("views", path.join(__dirname, "../PostFiles"));

// app.set("view engine", "ejs");

//Routes

// app.use("/", (req, res) => {
//   //store file
//   res.send("<h1>welcome</h1>");
// });

app.use("/api/files", require("./routes/files"));

// app.use("/files", require("./routes/show"));

app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
