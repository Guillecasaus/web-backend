const express = require("express")
const router = express.Router()
const { getItems, getItem, createItem, updateItem, deleteItem, onboardingCtrl, companyCtrl } = require("../controllers/users")
const { validatorCreateItem, validatorGetItem, validatorUpdateItem, validatorOnboarding, validatorCompany } = require("../validators/user")
const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/rol")

router.get("/", validatorGetItem, getItems)
router.get("/:id", validatorGetItem, getItem)
router.post("/", validatorCreateItem, createItem)
router.delete("/:id", validatorGetItem, deleteItem)
router.put("/onboarding", authMiddleware, validatorOnboarding, onboardingCtrl);
router.patch("/company", authMiddleware, validatorCompany, companyCtrl);

module.exports = router
