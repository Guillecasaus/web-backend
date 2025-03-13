const express = require("express")
const router = express.Router()
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/users")
const { validatorCreateItem, validatorGetItem, validatorUpdateItem } = require("../validators/user")
const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/rol")

router.get("/", validatorGetItem, getItems)
router.get("/:id", validatorGetItem, getItem)
router.post("/", validatorCreateItem, createItem)
router.patch("/:id", authMiddleware, checkRol(["admin"]), validatorGetItem, validatorUpdateItem, updateItem)
router.delete("/:id", validatorGetItem, deleteItem)

module.exports = router
