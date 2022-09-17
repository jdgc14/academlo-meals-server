const express = require('express')

// Controllers reviews
const {
    createRestaurantReview,
    updateReviewById,
    deleteReviewById,
} = require('../controllers/reviews.controllers')

// Middlewares
const { restaurantExists } = require('../middlewares/restaurants.middlewares')
const { reviewExists } = require('../middlewares/reviews.middlewares')

// Auth middlewares
const { protectReviewOwner } = require('../middlewares/auth.middlewares')

// Validators middlewares
const {
    createReviewValidators,
} = require('../middlewares/reviewsValidators.middlewares')

// Creating router
const reviewsRouter = express.Router()

reviewsRouter.post(
    '/:restaurantId',
    restaurantExists,
    createReviewValidators,
    createRestaurantReview
)

reviewsRouter.patch('/:id', reviewExists, protectReviewOwner, updateReviewById)

reviewsRouter.delete('/:id', reviewExists, protectReviewOwner, deleteReviewById)

module.exports = { reviewsRouter }
