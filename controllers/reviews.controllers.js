const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Review } = require('../models/review.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const {
    updateRestaurantRating,
} = require('../middlewares/restaurants.middlewares')

dotenv.config()

// >C< R U D
const createRestaurantReview = catchAsync(async (req, res, next) => {
    const { restaurant } = req

    const userId = req.sessionUser.id

    const { comment, rating } = req.body

    const newReview = await Review.create({
        userId,
        comment,
        rating,
        restaurantId: restaurant.id,
    })
    await updateRestaurantRating(restaurant)

    res.status(201).json({
        status: 'success',
        newReview,
    })
})

// C R >U< D
const updateReviewById = catchAsync(async (req, res, next) => {
    const { review, restaurant } = req

    const { comment, rating } = req.body

    await review.update({
        comment,
        rating,
    })

    await updateRestaurantRating(restaurant)

    res.status(200).json({
        status: 'success',
        review,
    })
})

// C R U >D<
const deleteReviewById = catchAsync(async (req, res, next) => {
    const { review, restaurant } = req

    await review.update({
        status: 'deleted,',
    })

    await updateRestaurantRating(restaurant)

    res.status(204).json({
        status: 'success',
    })
})

module.exports = { createRestaurantReview, updateReviewById, deleteReviewById }
