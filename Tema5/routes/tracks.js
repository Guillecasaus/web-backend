const express = require("express")
const router = express.Router()
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/tracks")
const { validatorCreateItem, validatorGetItem } = require("../validators/tracks")

router.get("/", getItems)
router.post("/", validatorCreateItem, createItem)
router.get("/:id", validatorGetItem, getItem)
router.put("/:id", validatorGetItem, updateItem)
router.delete("/:id", validatorGetItem, deleteItem)


module.exports = router
