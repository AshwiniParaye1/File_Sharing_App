const router = require("express").Router()
const dotenv = require("dotenv")
dotenv.config()
const multer = require("multer")
const path = require("path")
const File = require("../models/file")
const { v4: uuid4 } = require("uuid")
const sendMail = require("../services/emailService")
const emailTemplate = require("../services/emailTemplate")

// Set up multer disk storage and file upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/")
  },
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`
    callback(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 }
}).single("file")

// Handle file upload and store in DB
router.post("/", async (req, res) => {
  // handle file upload
  upload(req, res, async (err) => {
    // validate request
    if (!req.file) {
      return res.status(400).json({ error: "All fields are required." })
    }
    if (err) {
      return res.status(500).send({ error: err.message })
    }

    // create new file object and store in DB
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size
    })
    const response = await file.save()

    return res.json({
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    })
  })
})

// Send email with file download link
router.post("/send", async (req, res) => {
  console.log("======", req.body)
  const { uuid, emailTo, emailFrom } = req.body

  // validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(400).json({ error: "All fields are required." })
  }

  // get file from DB
  const file = await File.findOne({ uuid })

  // check if email has already been sent for this file
  if (file.sender) {
    return res.status(400).json({ error: "Email already sent." })
  }

  // update file with sender and receiver email
  file.sender = emailFrom
  file.receiver = emailTo
  const response = await file.save()

  // send email with download link
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "inShare file sharing",
    text: `${emailFrom} shared a file with you`,
    html: emailTemplate({
      emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      size: parseInt(file.size / 1000) + " KB",
      expires: "24 hours"
    })
  })

  return res.json({ success: true })
})

module.exports = router
