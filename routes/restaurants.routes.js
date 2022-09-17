const express = require('express')

// Controllers
const {
    createRestaurant,
    readActiveRestaurants,
    readRestaurantById,
    updateRestaurantById,
    deleteRestaurantById,
} = require('../controllers/restaurants.controllers')

// Middlewares
const { restaurantExists } = require('../middlewares/restaurants.middlewares')

// Auth middlewares
const {
    protectSession,
    protectAdmin,
} = require('../middlewares/auth.middlewares')

// Validators middlewares
const {
    createRestaurantValidators,
    updateRestaurantValidators,
} = require('../middlewares/restaurantValidators.middlewares')

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
