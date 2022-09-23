const express = require('express')

// Controllers reviews
const {
    createRestaurantReview,
    updateReviewById,
    deleteReviewById,
} = require('../controllers/reviews.controllers')

// Middlewares
const {
    restaurantIsActive,
    restaurantReviewIsActive,
} = require('../middlewares/restaurants.middlewares')
const {
    reviewIsActive,
    undoReviewRating,
} = require('../middlewares/reviews.middlewares')

// Auth middlewares
const { protectReviewOwner } = require('../middlewares/auth.middlewares')

// Validators middlewares
const {
    reviewValidators,
} = require('../middlewares/reviewsValidators.middlewares')

// Creating router
const reviewsRouter = express.Router()

reviewsRouter.post(
    '/:restaurantId',
    restaurantIsActive,
    reviewValidators,
    createRestaurantReview
)

reviewsRouter.patch(
    '/:id',
    reviewIsActive,
    restaurantReviewIsActive,
    reviewValidators,
    protectReviewOwner,
    undoReviewRating,
    updateReviewById
)

reviewsRouter.delete(
    '/:id',
    reviewIsActive,
    restaurantReviewIsActive,
    protectReviewOwner,
    undoReviewRating,
    deleteReviewById
)

module.exports = { reviewsRouter }
