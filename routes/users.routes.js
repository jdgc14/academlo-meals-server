const express = require('express')

// Controllers
const {
    readActiveUsers,
    createUser,
    updateUser,
    deleteUser,
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
} = require('../middlewares/validators.middlewares')

// Creating router
const usersRouter = express.Router()

// Assigning end-points
usersRouter.post('/', createUserValidators, createUser)

usersRouter.post('/login', loginUserValidators, login)

// Protecting below endpoints
usersRouter.use(protectSession)

// Access to admin users
usersRouter.get('/', protectAdmin, readActiveUsers)

// Account owner access
usersRouter.patch(
    '/:id',
    userExists,
    protectUsersAccount,
    updateUserValidators,
    updateUser
)

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser)

module.exports = { usersRouter }
