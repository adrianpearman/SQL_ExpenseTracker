const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../", "../", ".env"),
});

module.exports = {
  development: {
    database: process.env.DB_DEV_NAME,
    dialect: "postgres",
    host: process.env.DB_DEV_HOST,
    password: process.env.DB_DEV_PASSWORD,
    port: process.env.DB_DEV_PORT,
    username: process.env.DB_DEV_USERNAME,
  },
  production: {
    database: process.env.DB_PROD_NAME,
    dialect: "postgres",
    host: process.env.DB_PROD_HOST,
    password: process.env.DB_PROD_PASSWORD,
    port: process.env.DB_PROD_PORT,
    username: process.env.DB_PROD_USERNAME,
  },
  test: {
    database: process.env.DB_TEST_NAME,
    dialect: "postgres",
    host: process.env.DB_TEST_HOST,
    password: process.env.DB_TEST_PASSWORD,
    port: process.env.DB_TEST_PORT,
    username: process.env.DB_TEST_USERNAME,
  },
};
