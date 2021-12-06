// NPM Modules
const express = require("express")
const cors = require("cors")

// Application Variables
const app = express()
const PORT = process.env.PORT || 3001
const sequelize = require('../backend/database')

// Routes
const expenseRoutes = require("./routes/expenseRoutes")

//Applying Middlewares
app.use(cors())

//Routes Middlewares
app.use(expenseRoutes)

sequelize.authenticate()
  .then(() => console.log('connected to database'))
  .catch((err) => console.log(err))

// sequelize.sync({ force: true })
//   .then(() => console.log("All models were synchronized successfully."))
//   .catch(err => console.log(err));

app.listen(PORT, error => {

  if(error){
    console.log(error)
  } else{
    console.log(`Running on PORT: ${PORT}`)
  }
})
