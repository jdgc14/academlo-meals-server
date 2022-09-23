// Models
const { Restaurant } = require('../models/restaurant.model')
const { Review } = require('../models/review.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')
const { reducerReviews } = require('../utils/reviews.util')

const restaurantIsActive = catchAsync(async (req, res, next) => {
    const id = req.params.id || req.params.restaurantId

    const restaurant = await Restaurant.findOne({
        where: { id, status: 'active' },
    })

    // If restaurant doesn't exist, send error message
    if (!restaurant) {
        return next(new AppError('Restaurant not found', 404))
    }

    // Adding restaurant object to request
    req.restaurant = restaurant
    next()
})

const restaurantReviewIsActive = catchAsync(async (req, res, next) => {
    const { review } = req

    const restaurant = await Restaurant.findOne({
        where: {
            id: review.restaurantId,
            status: 'active',
        },
    })
    // If restaurant doesn't exist, send error message
    if (!restaurant) {
        return next(new AppError('Restaurant not found', 404))
    }

    // Adding restaurant object to request
    req.restaurant = restaurant
    next()
})

const updateRestaurantRating = async (restaurant) => {
    const restaurantReviews = await Review.findAll({
        where: { restaurantId: restaurant.id, status: 'active' },
    })

    const totalRating = restaurantReviews
        .map((review) => review.rating)
        .reduce(reducerReviews)

    const newRating = (totalRating / restaurantReviews.length).toFixed(1)

    await restaurant.update({
        rating: newRating,
    })
}
module.exports = {
    restaurantIsActive,
    restaurantReviewIsActive,
    updateRestaurantRating,
}
