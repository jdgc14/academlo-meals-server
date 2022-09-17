const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Restaurant } = require('../models/restaurant.model')
const { Review } = require('../models/review.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

dotenv.config()

// >C< R U D
const createRestaurant = catchAsync(async (req, res, next) => {
    const { name, address, rating } = req.body

    const newRestaurant = await Restaurant.create({
        name,
        address,
        rating,
    })

    res.status(201).json({
        status: 'success',
        newRestaurant,
    })
})

// C >R< U D
const readActiveRestaurants = catchAsync(async (req, res, next) => {
    const restaurants = await Restaurant.findAll({
        // attributes: { exclude: ['id', 'status',] },
        where: { status: 'active' },
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
    const { restaurant } = req

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
