const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Restaurant } = require('../models/restaurant.model')
const { Review } = require('../models/review.model')
const { Meal } = require('../models/meal.model')
const { User } = require('../models/user.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

dotenv.config()

// >C< R U D
const createRestaurant = catchAsync(async (req, res, next) => {
    const { name, address } = req.body

    const newRestaurant = await Restaurant.create({
        name,
        address,
    })

    res.status(201).json({
        status: 'success',
        newRestaurant,
    })
})

// C >R< U D
const readActiveRestaurants = catchAsync(async (req, res, next) => {
    const restaurants = await Restaurant.findAll({
        where: { status: 'active' },
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Review,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'comment', 'rating'],
                include: {
                    model: User,
                    required: false,
                    where: { status: 'active' },
                    attributes: ['id', 'name', 'email'],
                },
            },
            {
                model: Meal,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'name', 'price'],
            },
        ],
    })

    res.status(200).json({
        status: 'success',
        data: {
            restaurants,
        },
    })
})

// C >R< U D
const readRestaurantById = catchAsync(async (req, res, next) => {
    const { id } = req.restaurant

    /* Teacher i have a question:
    Is better to make another query to the database to bring the 'meals' associated with the
    restaurant, or is better to make the query directly in the middleware so that the entire
    object is always in the request?  */

    const restaurant = await Restaurant.findOne({
        where: { id, status: 'active' },
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Review,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'comment', 'rating'],
                include: {
                    model: User,
                    required: false,
                    where: { status: 'active' },
                    attributes: ['id', 'name', 'email'],
                },
            },
            {
                model: Meal,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'name', 'price'],
            },
        ],
    })

    res.status(200).json({
        status: 'success',
        restaurant,
    })
})

// C R >U< D
const updateRestaurantById = catchAsync(async (req, res, next) => {
    const { name, address } = req.body
    const { restaurant } = req

    await restaurant.update({ name, address })

    res.status(200).json({
        status: 'success',
        restaurant,
    })
})

// C R U >D<
const deleteRestaurantById = catchAsync(async (req, res, next) => {
    const { restaurant } = req

    // Soft delete
    await restaurant.update({ status: 'deleted' })

    res.status(204).json({ status: 'success' })
})

module.exports = {
    createRestaurant,
    readActiveRestaurants,
    readRestaurantById,
    updateRestaurantById,
    deleteRestaurantById,
}
