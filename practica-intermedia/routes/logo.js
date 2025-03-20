const express = require("express")
const router = express.Router();
const { updateImage } = require('../controllers/storage.js');
const { uploadMiddleware, uploadMiddlewareMemory } = require("../utils/handleStorage");
const authMiddleware = require('../middleware/authMiddleware.js');

router.patch("/", uploadMiddlewareMemory.single("logo"), updateImage);

module.exports = router;
