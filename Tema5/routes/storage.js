const express = require("express")
const router = express.Router();

const uploadMiddleware = require("../utils/handleStorage")

const { createItem } = require("../controllers/storage");
const { getItems } = require("../controllers/tracks");

router.get("/", getItems)

//router.get("/:id", getItem)

router.post("/", uploadMiddleware.single("image"), createItem)

module.exports = router;