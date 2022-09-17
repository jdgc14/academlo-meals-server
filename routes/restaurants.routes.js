const express = require('express')

// Controllers restaurants
const {
    createRestaurant,
    readActiveRestaurants,
    readRestaurantById,
    updateRestaurantById,
    deleteRestaurantById,
} = require('../controllers/restaurants.controllers')

// Controllers reviews
// const {
//     createRestaurantReview,
//     updateReviewById,
//     deleteReviewById,
// } = require('../controllers/reviews.controllers')

// Middlewares
const { restaurantExists } = require('../middlewares/restaurants.middlewares')
// const { reviewExists } = require('../middlewares/reviews.middlewares')

// Auth middlewares
const {
    protectSession,
    protectAdmin,
    // protectReviewOwner,
} = require('../middlewares/auth.middlewares')

// Validators middlewares
const {
    createRestaurantValidators,
    updateRestaurantValidators,
} = require('../middlewares/restaurantValidators.middlewares')

// const {
//     createReviewValidators,
// } = require('../middlewares/reviewsValidators.middlewares')

// Creating router
const restaurantsRouter = express.Router()

// Import reviews router
const { reviewsRouter } = require('./reviews.routes')

// Assigning end-points
restaurantsRouter.get('/', readActiveRestaurants)
restaurantsRouter.get('/:id', restaurantExists, readRestaurantById)

// Protecting endpoints
restaurantsRouter.use(protectSession)

restaurantsRouter.post('/', createRestaurantValidators, createRestaurant)

restaurantsRouter.use('/reviews', reviewsRouter)

// restaurantsRouter.post(
//     '/reviews/:restaurantId',
//     restaurantExists,
//     createReviewValidators,
//     createRestaurantReview
// )

// restaurantsRouter.patch(
//     '/reviews/:id',
//     reviewExists,
//     protectReviewOwner,
//     updateReviewById
// )

// restaurantsRouter.delete(
//     '/reviews/:id',
//     reviewExists,
//     protectReviewOwner,
//     deleteReviewById
// )

// Protecting endpoints to admin level
restaurantsRouter.use(protectAdmin)

restaurantsRouter.patch(
    '/:id',
    restaurantExists,
    updateRestaurantValidators,
    updateRestaurantById
)

restaurantsRouter.delete('/:id', restaurantExists, deleteRestaurantById)

module.exports = { restaurantsRouter }
