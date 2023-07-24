// NPM Modules
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
// Application Variables
const app = express();
const PORT = process.env.PORT || 3001;
const { sequelizeConfig } = require("../backend/utils");
// Routes
const bulkActionRoutes = require("./routes/bulkActionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const locationRoutes = require("./routes/locationRoutes");
const userRoutes = require("./routes/userRoutes");
//Applying Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Importing Application Routes
app.use(bulkActionRoutes);
app.use(categoryRoutes);
app.use(expenseRoutes);
app.use(locationRoutes);
app.use(userRoutes);

app.listen(PORT, async (err) => {
  try {
    if (err) {
      throw new Error(err);
    }
    console.log(`Running on PORT: ${PORT}`);
    // Ensuring that there is a connection to the DB
    await sequelizeConfig().authenticate();
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
});
