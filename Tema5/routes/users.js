const express = require("express")
const router = express.Router()
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/users")
const { validatorCreateItem, validatorGetItem } = require("../validators/user")

router.get("/", validatorGetItem, getItems)
router.get("/:id", validatorGetItem, getItem)
router.post("/", validatorCreateItem, createItem)
router.put("/:id", validatorGetItem, updateItem)
router.delete("/:id", validatorGetItem, deleteItem)

module.exports = router
