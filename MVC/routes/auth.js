// routes/auth.js
const express = require("express");
const router = express.Router();

const { validatorRegister, validatorLogin } = require("../validators/auth");
const { registerCtrl, loginCtrl } = require("../controllers/auth");

// Ruta para registrar
router.post("/register", validatorRegister, registerCtrl);

// Ruta para login
router.post("/login", validatorLogin, loginCtrl);

module.exports = router;
