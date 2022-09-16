const { app } = require('./app')
// const dotenv = require('dotenv')

// Import database util
const { db } = require('./utils/database.util')

// To start server
const startServer = async () => {
    try {
        await db.authenticate()

        await db.sync()

        const PORT = 4000

        // Set server to listen
        app.listen(PORT, () => {
            console.log('Express app running!')
        })
    } catch (err) {
        console.log(err)
    }
}

startServer()
