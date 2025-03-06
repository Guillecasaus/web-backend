const express = require("express")
const router = express.Router()
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/tracks")
const { validatorCreateItem, validatorGetItem } = require("../validators/tracks")
const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/rol")

router.get("/", authMiddleware, getItems)
router.get("/:id", validatorGetItem, getItem)
router.put("/:id", authMiddleware, checkRol(["admin"]), validatorGetItem, updateItem)
router.delete("/:id", validatorGetItem, deleteItem)
router.post("/", authMiddleware, checkRol(["admin"]), validatorCreateItem, createItem)

module.exports = router
