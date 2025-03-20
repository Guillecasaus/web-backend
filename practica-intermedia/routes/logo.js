const express = require("express")
const router = express.Router();
const { uploadMiddleware, uploadMiddlewareMemory } = require("../utils/handleStorage");

//const { createItem } = require("../controllers/storage");
const { updateImage } = require("../controllers/storage");
const { getItems } = require("../controllers/tracks");

router.get("/", getItems)

//router.get("/:id", getItem)

//router.post("/", uploadMiddleware.single("image"), createItem)

router.post("/", uploadMiddlewareMemory.single("image"), updateImage)

module.exports = router;