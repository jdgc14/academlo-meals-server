const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Review } = require('../models/review.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')

dotenv.config()

// >C< R U D
const createRestaurantReview = catchAsync(async (req, res, next) => {
    const { restaurant } = req

    const userId = req.sessionUser.id

    const { restaurantId } = req.params

    const { comment, rating } = req.body

    const newReview = await Review.create({
        userId,
        comment,
        rating,
        restaurantId,
    })

    res.status(201).json({
        status: 'success',
        newReview,
        restaurant,
    })
})

// C R >U< D
const updateReviewById = catchAsync(async (req, res, next) => {
    const { review } = req

    res.status(200).json({
        status: 'updating',
        review,
    })
})

// C R U >D<
const deleteReviewById = catchAsync(async (req, res, next) => {
    const { review } = req

    res.status(200).json({
        status: 'deleting',
        review,
    })
})

module.exports = { createRestaurantReview, updateReviewById, deleteReviewById }
