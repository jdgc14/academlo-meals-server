const { body, validationResult } = require('express-validator')
const { AppError } = require('../utils/appError.util')

const checkValidations = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg)

        const message = errorMessages.join('. ')

        return next(new AppError(message, 400))
    }

    next()
}

const strongPasswordOptions = {
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 0,
    pointsForContainingLower: 10,
    pointsForContainingNumber: 10,
    pointsForContainingUpper: 10,
    pointsPerRepeat: 1,
    pointsPerUnique: 2,
    returnScore: false,
}

const createUserValidators = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password')
        .isStrongPassword(strongPasswordOptions)
        .withMessage(
            'Please enter a password at least 8 character and contain At least one uppercase. At least one lower case.At least one number.'
        ),
    checkValidations,
]

const updateUserValidators = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    checkValidations,
]

const loginUserValidators = [
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password').notEmpty().withMessage('Must provide a password.'),
    checkValidations,
]

module.exports = {
    createUserValidators,
    updateUserValidators,
    loginUserValidators,
}
