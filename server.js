const { app } = require('./app')
// const dotenv = require('dotenv')

// Import database util
const { db } = require('./utils/database.util')
const { initModels } = require('./models/initModels')

// To start server
const startServer = async () => {
    try {
        await db.authenticate()

        // Establish the relations between models
        initModels()

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
