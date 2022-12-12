require('dotenv').config();
const express = require('express')

const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const weatherRouter = require('./routes/weather')

app.use(cors())
app.use(bodyParser.json())
app.use('/api/weather', weatherRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`SERVER LISTENING ON PORT ${PORT}`)
})

