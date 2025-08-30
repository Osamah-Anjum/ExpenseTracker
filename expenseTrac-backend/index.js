import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { expenseRoute, loginRoute, regRoute } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config({override: true})
const app = express()

//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

//ROUTES
app.use("/api/auth", regRoute)
app.use("/api/auth", loginRoute)
app.use("/api/expenses", expenseRoute)

app.use(errorHandler)

//CONNECTING DB & STARTING SERVER
mongoose.connect(process.env.MONGODB_URI).then(
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on PORT ${process.env.PORT}`)
  })
).catch((err) => console.log(err))