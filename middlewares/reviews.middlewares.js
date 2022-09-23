// Models
const { Review } = require('../models/review.model')
const { Restaurant } = require('../models/restaurant.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const reviewIsActive = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const review = await Review.findOne({
        where: { id, status: 'active' },
    })

    // If review doesn't exist, send error message
    if (!review) {
        return next(new AppError('Review not found', 404))
    }

    // Adding review object to request
    req.review = review
    next()
})

// undo review
const undoReviewRating = catchAsync(async (req, res, next) => {
    const { review } = req
    const { restaurant } = req

    const newRating = restaurant.rating * 2 - review.rating

    await restaurant.update({
        rating: newRating,
    })

    next()
})

module.exports = {
    reviewIsActive,
    undoReviewRating,
}
