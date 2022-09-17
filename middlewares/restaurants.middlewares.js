// Models
const { Restaurant } = require('../models/restaurant.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const restaurantExists = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const restaurant = await Restaurant.findOne({
        where: { id },
        // attributes: { exclude: [] },
    })

    // If restaurant doesn't exist, send error message
    if (!restaurant) {
        return next(new AppError('Restaurant not found', 404))
    }

    // Adding restaurant object to request
    req.restaurant = restaurant
    next()
})

module.exports = { restaurantExists }
