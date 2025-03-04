const { check, validationResult } = require('express-validator');

const userValidator = [
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
        .isIn(['user', 'admin']).withMessage('Role must be either user or admin')
];

const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    userValidator,
    validateUser
};