import express from 'express'
import { MongoClient, MongoServerError } from 'mongodb'
import ViteExpress from "vite-express";

// Definitions
const { MONGO_ADMIN_USER, MONGO_ADMIN_PASS, ENV_LOCAL } = process.env // Import user and pass from SYSTEM environments
// add LINUX variables by editing "nano ~/.profile" and adding "export MONGO_ADMIN_USER=username"
// add WINDOWS variables with "setx ENV_LOCAL true"
// add JENKINS variables with "credentials"
// OR in docker compose environment

// Database endpoint check and connect
let mongo = undefined
if (ENV_LOCAL) { // Local environment
    mongo = new MongoClient(`mongodb://127.0.0.1:27017`)
} else { // use container name when starting application as docker container, part of docker-compose
    mongo = new MongoClient(`mongodb://${MONGO_ADMIN_USER}:${MONGO_ADMIN_PASS}@ub-mongodb`)
}
const db = mongo.db('utm-builder')

// Start express server
const app = express() // Initialize the express server


// Middleware
app.use(express.json()) // needed to parse the JSON to JS first, otherwise you gat an error!
//app.use(express.static('dist')) // serves the index.html file on load from the dist folder, so you can use the frontend app on the express app port (e.g. - localhost:3000). This is actually not needed if you configure the vite.config server.proxy!

// GET Tagged URLs endpoint
app.get('/api/users/:clientId/get-tagged-urls', async (req, res) => {
    const clientId = req.params.clientId

    // Connect to DB
    await mongo.connect()
    console.log('Connected to DB successfully')

    // get data from db
    const getUrls = await db.collection('taggedUrls')
        .find({ clientId: clientId })
        .sort({createdAt: -1}) // Sort by _id in descending order to get the latest items first
        .limit(15) // Limit the results to the last 10 items
        .project({ taggedUrl: 1 })
        .toArray()

    // Send a response to frontend
    res.json(getUrls)

    // Disconnect
    await mongo.close()
    console.log('Disconnected from DB successfully')

})


// POST Tagged URLs endpoint (RequestHandler function to handle requests and responses (req, res))
app.post('/api/users/:clientId/save-tagged-url', async (req, res) => {
    const payload = req.body
    // const clientId = req.params.clientId

    // Connect to DB
    await mongo.connect()
    console.log('Connected to DB successfully')

    // Save payload to DB with expiration time
    try {
        payload['createdAt'] = new Date()
        await db.collection('taggedUrls').insertOne(payload)
        await db.collection('taggedUrls').createIndex({createdAt: 1}, { expireAfterSeconds: 86400 })
    } catch(err) {
        if (err instanceof MongoServerError) {
            console.error(`There is an error: ${err}`)
        }
        throw err
    }

    // Send a response to frontend
    res.json(payload)

    // Disconnect
    await mongo.close()
    console.log('Disconnected from DB successfully')

})



// app.listen(3000, () => { console.log('Server is listening on port 3000') }) // replaced by ViteExpress
ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on:\n\nhttp://localhost:3000\n\n"),
  );
