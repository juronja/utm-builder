import express from 'express'
import { MongoClient, MongoServerError } from 'mongodb'

// Definitions
const ISODate = new Date().toISOString()
const { MONGO_ADMIN_USER, MONGO_ADMIN_PASS, ENV_LOCAL } = process.env // Import user and pass from SYSTEM environments
// add LINUX variables with "export MONGO_ADMIN_USER=username"
// add WINDOWS variables with "setx ENV_LOCAL true"
// OR in docker compose environment


// Database endpoint check and connect
let mongo = undefined
if (ENV_LOCAL) { // Local environment
    mongo = new MongoClient(`mongodb://127.0.0.1:27017`)
} else { // Docker compose dev
    mongo = new MongoClient(`mongodb://${MONGO_ADMIN_USER}:${MONGO_ADMIN_PASS}@mongodb`)
}
const db = mongo.db('utm-builder')


// Start express server
const app = express()
app.listen(3000, () => { console.log('Server is listening on port 3000') }) // define server listening port

// Middleware
app.use(express.json()) // needed to parse the JSON to JS first, otherwise you gat an error!
//app.use(express.static('dist')) // serves the index.html file on load from the dist folder, so you can use the frontend app on the express app port (e.g. - localhost:3000). This is actually not needed if you configure the vite.config server.proxy!

// GET method
app.get('/users/:clientId/get-tagged-urls', async (req, res) => {
    const clientId = req.params.clientId
    
    // Connect to DB
    await mongo.connect()
    console.log('Connected successfully to database')

    // get data from db
    const getUrls = await db.collection('taggedUrls')
        .find({ clientId: clientId })
        .sort({_id: -1}) // Sort by _id in descending order to get the latest items first
        .limit(10) // Limit the results to the last 10 items
        .project({ taggedUrl: 1 })
        .toArray()
    console.log('Got this URLs: ', getUrls)
    
    // Send a response to frontend
    res.json(getUrls)
    
    // Disconnect
    await mongo.close()
    console.log('Disconnected successfully')

})


// POST method endpoint + RequestHandler function to handle requests and responses (req, res).
app.post('/users/:clientId/save-tagged-url', async (req, res) => {
    const payload = req.body
    const clientId = req.params.clientId
    
    // Connect to DB
    await mongo.connect()
    console.log('Connected successfully to database')

    // Save payload to DB
    try {
        payload['created'] = ISODate
        await db.collection('taggedUrls').insertOne(payload)
        console.log('Saved to DB: ', payload)

    } catch(err) {
        if (err instanceof MongoServerError) {
            console.error(`There is an error: ${err}`)
        }
        throw err
    }
    
    // Send a response to frontend
    res.json(payload.taggedUrl)
    
    // Disconnect
    await mongo.close()
    console.log('Disconnected successfully')

})