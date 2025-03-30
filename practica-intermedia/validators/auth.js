const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegister = [
    check("name").exists().notEmpty().withMessage("Name is required"),
    check("email").exists().notEmpty().isEmail().withMessage("Valid email is required"),
    check("password").exists().notEmpty().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    check("role").optional().isIn(["user", "admin", "guest", "autonomo"]).withMessage("Role must be either user, admin, guest or autonomo"),
    (req, res, next) => validateResults(req, res, next)
];

const validatorLogin = [
    check("email").exists().notEmpty().isEmail().withMessage("Valid email is required"),
    check("password").exists().notEmpty().withMessage("Password is required"),
    (req, res, next) => validateResults(req, res, next)
];

const validatorEmailValidation = [
    check("code").exists().notEmpty().isLength({ min: 6, max: 6 }).withMessage("Code must be 6 digits"),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorRegister, validatorLogin, validatorEmailValidation };
