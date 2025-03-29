const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    check('age')
        .optional()
        .isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('role')
        .optional()
        .isIn(['user', 'admin', 'guest']).withMessage('Role must be either user or admin'),
    (req, res, next) => validateResults(req, res, next)
];

const validatorGetItem = [
    check("id").exists().notEmpty().isMongoId(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorUpdateItem = [
    check("id", "Invalid ID")
        .exists()
        .notEmpty()
        .isMongoId(),

    // Campos del body que se pueden actualizar (todos opcionales):
    check("name")
        .optional()
        .isString().withMessage("Name must be a string"),
    check("age")
        .optional()
        .isInt({ min: 0 }).withMessage("Age must be a positive integer"),
    check("email")
        .optional()
        .isEmail().withMessage("Email must be valid"),
    check("password")
        .optional()
        .isLength({ min: 8 }).withMessage("Password must be at least 6 characters long"),
    check("role")
        .optional()
        .isIn(["user", "admin", "guest"]).withMessage("Role must be either user or admin"),

    // Middleware final que chequea si hubo errores
    (req, res, next) => validateResults(req, res, next)
];

const validatorOnboarding = [
    check("name")
        .exists().withMessage("Name is required")
        .notEmpty().withMessage("Name cannot be empty")
        .isString().withMessage("Name must be a string"),
    check("lastname")
        .exists().withMessage("Lastname is required")
        .notEmpty().withMessage("Lastname cannot be empty")
        .isString().withMessage("Lastname must be a string"),
    check("nif")
        .exists().withMessage("NIF is required")
        .notEmpty().withMessage("NIF cannot be empty")
        .isAlphanumeric().withMessage("NIF must be alphanumeric"),
    (req, res, next) => validateResults(req, res, next)
];

const validatorCompany = [
    check("companyName")
        .exists().withMessage("Company name is required")
        .notEmpty().withMessage("Company name cannot be empty")
        .isString().withMessage("Company name must be a string"),
    check("cif")
        .exists().withMessage("CIF is required")
        .notEmpty().withMessage("CIF cannot be empty")
        .isAlphanumeric().withMessage("CIF must be alphanumeric"),
    check("address")
        .exists().withMessage("Address is required")
        .notEmpty().withMessage("Address cannot be empty")
        .isString().withMessage("Address must be a string"),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = {
    validatorCreateItem,
    validatorGetItem,
    validatorUpdateItem,
    validatorOnboarding,
    validatorCompany
};