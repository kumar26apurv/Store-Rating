const { body, validationResult } = require('express-validator');

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/; 

const validateUserFields = [
    body('name')
        .trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.'),
    body('email')
        .trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address.'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters long.')
        .matches(passwordRegex).withMessage('Password must contain at least one uppercase letter and one special character (!@#$%^&*).'),
        
    body('address')
        .optional({ checkFalsy: true })
        .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters.'),
];

const validateChangePassword = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required.'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8, max: 16 }).withMessage('New password must be between 8 and 16 characters long.')
        .matches(passwordRegex).withMessage('New password must contain at least one uppercase letter and one special character (!@#$%^&*).'),
];

const validateStoreFields = [ 

    body('name')
        .trim().notEmpty().withMessage('Store Name is required.')
        .isLength({ min: 20, max: 60 }).withMessage('Store Name must be between 20 and 60 characters.'),
    body('email')
        .trim().notEmpty().withMessage('Store Email is required.')
        .isEmail().withMessage('Must be a valid email address for the store.'),

    body('address')
        .notEmpty().withMessage('Address is required.')
        .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters.'),
    
  
    body('ownerId')
        .notEmpty().withMessage('Owner ID is required.')
        .isInt({ min: 1 }).withMessage('Owner ID must be a positive integer.'),
];
const validateRating = [ 
    body('storeId')
        .notEmpty().withMessage('Store ID is required.')
        .isInt({ min: 1 }).withMessage('Store ID must be a positive integer.'),
    
    body('rating')
        .notEmpty().withMessage('Rating value is required.')
        .isInt({ min: 1, max: 5 }).withMessage('Rating value must be between 1 and 5.'),
];
const handleValidationErrors = (req, res, next) => {
  
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = errors.array().map(err => err.msg);
   
    return res.status(400).json({
        error: 'Validation failed',
        details: extractedErrors
    });
};

module.exports = {
    validateUserFields,
    validateChangePassword,
    validateStoreFields, 
    validateRating,
    handleValidationErrors,
};