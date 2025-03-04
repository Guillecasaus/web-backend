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
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
    (req, res, next) => validateResults(req, res, next)
];

const validatorGetItem = (req, res, next) => {
    check("id").exists().notEmpty().isMongoId(),
        (req, res, next) => validateResults(req, res, next)
};

module.exports = {
    validatorCreateItem,
    validatorGetItem
};