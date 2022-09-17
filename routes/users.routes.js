const express = require('express')

// Controllers
const {
    readActiveUsers,
    createUser,
    updateUserById,
    deleteUserById,
    login,
} = require('../controllers/users.controller')

// Middlewares
const { userExists } = require('../middlewares/users.middlewares')

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
usersRouter.post('/', createUserValidators, createUser)

usersRouter.post('/login', loginUserValidators, login)

// Protecting endpoints
usersRouter.use(protectSession)

// Access to admin users
usersRouter.get('/', protectAdmin, readActiveUsers)

// Account owner access
usersRouter.patch(
    '/:id',
    userExists,
    protectUsersAccount,
    updateUserValidators,
    updateUserById
)

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUserById)

module.exports = { usersRouter }
