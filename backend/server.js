// NPM Modules
const bodyParser = require("body-parser")
const cors = require("cors")
const express = require("express")

// Application Variables
const app = express()
const PORT = process.env.PORT || 3001
const sequelize = require('../backend/database')

// Routes
const categoryRoutes = require("./routes/categoryRoutes")
const expenseRoutes = require("./routes/expenseRoutes")
const userRoutes  = require('./routes/userRoutes')

//Applying Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importing Application Routes
app.use(categoryRoutes)
app.use(expenseRoutes)
app.use(userRoutes)

sequelize.authenticate()
  .then(() => console.log('connected to database'))
  .catch((err) => console.log(err))

app.listen(PORT, error => {
  if(error){
    console.log(error)
  } else{
    console.log(`Running on PORT: ${PORT}`)
  }
})
