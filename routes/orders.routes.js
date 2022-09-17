const express = require('express')

// Controllers
const {
    createOrder,
    readOrdersByUser,
    updateOrder,
    deletOrder,
} = require('../controllers/orders.controllers')

// Middlewares
const { orderIsActive } = require('../middlewares/orders.middlewares')

// Auth middlewares
const {
    protectSession,
    protectOrderOwner,
} = require('../middlewares/auth.middlewares')

// Validators middlewares
const {
    createMealValidators,
} = require('../middlewares/orderValidator.middleware')

// Creating router
const ordersRouter = express.Router()

// Protecting endpoints
ordersRouter.use(protectSession)

ordersRouter.post('/', createMealValidators, createOrder)

ordersRouter.get('/me', readOrdersByUser)

ordersRouter.patch('/:id', orderIsActive, protectOrderOwner, updateOrder)

ordersRouter.delete('/:id', orderIsActive, protectOrderOwner, deletOrder)

module.exports = { ordersRouter }
