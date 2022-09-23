const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Order } = require('../models/order.model')
const { Meal } = require('../models/meal.model')
const { Restaurant } = require('../models/restaurant.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

dotenv.config()

// >C< R U D
const createOrder = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
    const { quantity, mealId } = req.body

    const meal = await Meal.findOne({
        where: { id: mealId, status: 'active' },
    })

    if (!meal) {
        return next(new AppError('Meal not found', 404))
    }

    const newOrder = await Order.create({
        mealId,
        userId: sessionUser.id,
        totalPrice: quantity * meal.price,
        quantity,
    })

    res.status(201).json({
        status: 'success',
        newOrder,
    })
})

// C >R< U D
const readOrdersByUser = catchAsync(async (req, res, next) => {
    const { id } = req.sessionUser

    const orders = await Order.findAll({
        where: { userId: id },
        attributes: { exclude: ['mealId', 'userId'] },
        include: {
            model: Meal,
            attributes: ['id', 'name', 'price'],
            include: {
                model: Restaurant,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
        },
    })

    res.status(200).json({
        status: 'success',
        orders,
    })
})

const readOrderById = catchAsync(async (req, res, next) => {
    const { order } = req
    const user = req.sessionUser

    res.status(200).json({
        status: 'success',
        data: {
            user,
            order,
        },
    })
})

// C R >U< D
const updateOrder = catchAsync(async (req, res, next) => {
    const { order } = req

    await order.update({ status: 'completed' })

    res.status(200).json({
        status: 'success',
        order,
    })
})

// C R U >D<
const deletOrder = catchAsync(async (req, res, next) => {
    const { order } = req

    await order.update({ status: 'cancelled' })

    res.status(204).json({ status: 'success' })
})

module.exports = {
    createOrder,
    readOrdersByUser,
    readOrderById,
    updateOrder,
    deletOrder,
}
