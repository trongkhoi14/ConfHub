const express = require('express');
const cors = require('cors');
require('dotenv').config();

const router = require('./src/routes')
const dbConnect = require('./src/config/dbconnect')
const cookieParser = require('cookie-parser')
const { notFound, errorHandler } = require('./src/middlewares/errorHandling')
const { rateLimiter } = require('./src/utils/rate-limiter');
const { infoLogger } = require('./src/utils/logger');


const app = express()
const port = process.env.PORT || 8081

app.use(cors())

// middleware parse cookie
app.use(cookieParser())

// middleware limit number of requests
app.use(rateLimiter);

// middleware log information about the interactions and activities
app.use(infoLogger);

// middleware parse json and req.body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// middleware serve static files
// chưa cần :>>>

// connect to database
dbConnect()

// create router
router(app)

// middleware handle error
app.use(notFound)
app.use(errorHandler)

// schedule crawl data

app.listen(port, () => {
  console.log(`Server was running on port ${port}`)
})
