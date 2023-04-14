const router = require("express").Router();

const multer = require("multer");

const path = require("path");

const File = require("../models/file");

const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "uploads/"),
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 },
}).single("myfile");

// console.log("upload", upload);

router.post("/", (req, res) => {
  //store file
  //   console.log(req);

  upload(req, res, async (err) => {
    // console.log(res);

    //validate request
    if (!req.file) {
      return res.json({ error: "All fileds are required." });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    // console.log(upload);
    //store into database

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,

      //http://localhost:3000/files/234vfbgfhbt34-234235gsbvsadf
    });
  });

  //response => link
});

module.exports = router;
