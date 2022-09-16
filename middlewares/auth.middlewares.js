const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { User } = require('../models/user.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

dotenv.config()

const protectSession = catchAsync(async (req, res, next) => {
    // Get token
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Extract token
        token = req.headers.authorization.slice(7)
    }

    // Check if the token was sent or not
    if (!token) {
        return next(new AppError('Invalid session', 403))
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Verify the token's owner
    const user = await User.findOne({
        where: { id: decoded.id, status: 'active' },
    })

    if (!user) {
        return next(
            new AppError('The owner of the session is no longer active', 403)
        )
    }

    // Grant access
    req.sessionUser = user
    next()
})

const protectUsersAccount = (req, res, next) => {
    const { sessionUser, user } = req

    // If the users (ids) don't match, send an error
    if (sessionUser.id !== user.id) {
        return next(new AppError('You are not the owner of this account.', 403))
    }

    // If the ids match, grant access
    next()
}

// Create middleware to protect posts, only owners should be able to update/delete
const protectPostsOwners = (req, res, next) => {
    const { sessionUser, post } = req

    if (sessionUser.id !== post.userId) {
        return res.status(403).json({
            status: 'error',
            message: 'This post does not belong to you.',
        })
    }

    next()
}

// Create middleware to protect comments, only owners should be able to update/delete
const protectCommentsOwners = (req, res, next) => {
    const { sessionUser, comment } = req

    if (sessionUser.id !== comment.userId) {
        return res.status(403).json({
            status: 'error',
            message: 'This comment does not belong to you.',
        })
    }

    next()
}

// Create middleware that only grants access to admin users
const protectAdmin = (req, res, next) => {
    const { sessionUser } = req

    if (sessionUser.role !== 'admin') {
        return next(
            new AppError('You do not have the access level for this data.', 403)
        )
    }

    next()
}

module.exports = {
    protectSession,
    protectUsersAccount,
    protectPostsOwners,
    protectCommentsOwners,
    protectAdmin,
}
