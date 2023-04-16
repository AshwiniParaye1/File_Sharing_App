const router = require("express").Router();

require("dotenv").config();

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

  router.post("/send", async (req, res) => {
    console.log(req.body);

    const { uuid, emailTo, emailFrom } = req.body;

    //validate request

    if (!uuid || !emailFrom || !emailTo) {
      return res.status(422).send({ error: "All fields are required." });
    }

    //get data from DB

    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent." });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //send email

    const sendMail = require("../services/emailService");

    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "inShare file sharing",
      text: `${emailFrom} shared a file with you`,
      html: require("../services/emailTemplate")({
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + " KB",
        expires: "24 hours",
      }),
    });
    return res.send({ success: true });
  });

  //response => link
});

module.exports = router;
