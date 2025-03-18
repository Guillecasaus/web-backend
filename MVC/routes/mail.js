const { validatorMail } = require("../validators/mail");
const { send } = require("../controllers/mail");
const authMiddleware = require("../middleware/session.js")

const express = require("express");


const router = express.Router();

router.post("/mail", authMiddleware, validatorMail, send);

module.exports = router;