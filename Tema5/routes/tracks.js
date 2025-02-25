const express = require("express")
const router = express.Router()
const { getItems, getItem, createItem } = require("../controllers/tracks")
const { validatorCreateItem } = require("../validators/tracks")

router.get("/", getItems)
router.get("/:id", getItem)

router.post("/", validatorCreateItem, createItem)

module.exports = router
