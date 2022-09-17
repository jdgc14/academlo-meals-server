const { checkValidations, body } = require('../utils/expressValidator.util')

const mealValidators = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 4 })
        .withMessage('Name must be at least 4 characters'),
    body('price').isNumeric().withMessage('Price must be a number'),
    checkValidations,
]

module.exports = { mealValidators }
