const express = require('express')

// Controllers
const {
    readActiveUsers,
    createUser,
    updateUserById,
    deleteUserById,
    login,
    readOrders,
    readOrderById,
} = require('../controllers/users.controller')

// Middlewares

// Auth middlewares
const {
    protectSession,
    protectUsersAccount,
    protectAdmin,
} = require('../middlewares/auth.middlewares')

// Validators middlewares
const {
    createUserValidators,
    updateUserValidators,
    loginUserValidators,
} = require('../middlewares/usersValidators.middlewares')

// Creating router
const usersRouter = express.Router()

// Assigning end-points
usersRouter.post('/signup', createUserValidators, createUser)

usersRouter.post('/login', loginUserValidators, login)

// Protecting endpoints
usersRouter.use(protectSession)

// Access to admin users
usersRouter.get('/', protectAdmin, readActiveUsers)

// Account owner access
usersRouter.patch(
    '/:id',
    protectUsersAccount,
    updateUserValidators,
    updateUserById
)

usersRouter.delete('/:id', protectUsersAccount, deleteUserById)

usersRouter.get('/orders', readOrders)

usersRouter.get('/orders/:id', readOrderById)

module.exports = { usersRouter }
