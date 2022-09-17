const express = require('express')

// Controllers
const {
    createMeal,
    readActiveMeals,
    readActiveMealById,
    updateMealById,
    deleteMealById,
} = require('../controllers/meals.controllers')

// Middlewares
const { mealExists } = require('../middlewares/meals.middlewares')
const { restaurantIsActive } = require('../middlewares/restaurants.middlewares')

// Auth middlewares
const {
    protectSession,
    protectAdmin,
} = require('../middlewares/auth.middlewares')

// Validators middlewares
const { mealValidators } = require('../middlewares/mealsValidators.middlewares')

// Creating router
const mealsRouter = express.Router()

// Assigning end-points
mealsRouter.get('/', readActiveMeals)
mealsRouter.get('/:id', mealExists, readActiveMealById)

// Protecting endpoints
mealsRouter.use(protectSession)

// Protecting endpoints to admin level
mealsRouter.use(protectAdmin)

mealsRouter.post('/:id', restaurantIsActive, mealValidators, createMeal)
mealsRouter.patch('/:id', mealExists, mealValidators, updateMealById)
mealsRouter.delete('/:id', mealExists, deleteMealById)

module.exports = { mealsRouter }
