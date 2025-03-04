const express = require("express")
const router = express.Router()
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/tracks")
const { validatorCreateItem, validatorGetItem } = require("../validators/tracks")
const authMiddleware = require("../middleware/session")

router.get("/", authMiddleware, getItems)
router.post("/", authMiddleware, validatorCreateItem, createItem)
router.get("/:id", validatorGetItem, getItem)
router.put("/:id", validatorGetItem, updateItem)
router.delete("/:id", validatorGetItem, deleteItem)


module.exports = router
