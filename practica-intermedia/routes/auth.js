const express = require("express");
const router = express.Router();
const { validatorRegister, validatorLogin, validatorEmailValidation } = require("../validators/auth");
const { registerCtrl, loginCtrl, validateEmailCtrl, recoverPasswordCtrl, resetPasswordCtrl } = require("../controllers/auth");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", validatorRegister, registerCtrl);
router.post("/login", validatorLogin, loginCtrl);
router.put("/validate", authMiddleware, validatorEmailValidation, validateEmailCtrl);
router.post("/recover-password", recoverPasswordCtrl);
router.post("/reset-password", resetPasswordCtrl);

module.exports = router;
