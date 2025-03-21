const express = require("express")
const router = express.Router();
const { uploadMiddleware, uploadMiddlewareMemory } = require("../utils/handleStorage");

//const { createItem } = require("../controllers/storage");
const { updateImage, createItem } = require("../controllers/storage");

//router.get("/:id", getItem)

//router.post("/", uploadMiddleware.single("image"), createItem)

router.post("/", uploadMiddlewareMemory.single("logo"), createItem)

module.exports = router;