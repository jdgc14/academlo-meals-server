const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Order } = require('../models/order.model')
const { Meal } = require('../models/meal.model')

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
    console.log(meal)

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
// dont ready
const readOrdersByUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req

    res.status(200).json({
        status: 'hacer la logica',
        sessionUser,
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

module.exports = { createOrder, readOrdersByUser, updateOrder, deletOrder }
