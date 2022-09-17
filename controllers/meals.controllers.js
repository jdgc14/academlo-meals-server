const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Meal } = require('../models/meal.model')
const { Restaurant } = require('../models/restaurant.model')
const { Review } = require('../models/review.model')
const { User } = require('../models/user.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

dotenv.config()

// >C< R U D
const createMeal = catchAsync(async (req, res, next) => {
    const { id } = req.restaurant

    const { name, price } = req.body

    const newMeal = await Meal.create({
        name,
        price,
        restaurantId: id,
    })

    res.status(201).json({
        status: 'success',
        newMeal,
    })
})

// C >R< U D
const readActiveMeals = catchAsync(async (req, res, next) => {
    const meals = await Meal.findAll({
        attributes: ['id', 'name', 'price'],
        where: { status: 'active' },
        include: {
            model: Restaurant,
            where: { status: 'active' },

            /* Here i don't use required because i think if restaurant is disabled, user can't buy this food
            required: false, // Apply OUTER JOIN */

            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
            include: {
                model: Review,
                where: { status: 'active' },
                required: false,
                attributes: ['id', 'comment', 'rating'],
                include: {
                    model: User,
                    required: false,
                    attributes: ['id', 'name', 'email'],
                },
            },
        },
    })

    res.status(200).json({
        status: 'success',
        data: {
            meals,
        },
    })
})

// C >R< U D
const readActiveMealById = catchAsync(async (req, res, next) => {
    const { id } = req.meal

    const meal = await Meal.findOne({
        where: { id, status: 'active' },
        attributes: ['id', 'name', 'price'],
        include: {
            model: Restaurant,
            where: { status: 'active' },

            /* Here i don't use required because i think if restaurant is disabled, user can't buy this food
            required: false, // Apply OUTER JOIN */

            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
            include: {
                model: Review,
                where: { status: 'active' },
                required: false,
                attributes: ['id', 'comment', 'rating'],
                include: {
                    model: User,
                    required: false,
                    attributes: ['id', 'name', 'email'],
                },
            },
        },
    })

    res.status(200).json({
        status: 'success',
        data: {
            meal,
        },
    })
})

// C R >U< D
const updateMealById = catchAsync(async (req, res, next) => {
    const { name, price } = req.body
    const { meal } = req

    await meal.update({ name, price })

    res.status(200).json({
        status: 'success',
        meal,
    })
})

// C R U >D<
const deleteMealById = catchAsync(async (req, res, next) => {
    const { meal } = req

    // Soft delete
    await meal.update({ status: 'deleted' })

    res.status(204).json({ status: 'success' })
})

module.exports = {
    createMeal,
    readActiveMeals,
    readActiveMealById,
    updateMealById,
    deleteMealById,
}
