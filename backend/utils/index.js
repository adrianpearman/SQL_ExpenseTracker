// NPM Modules
const axios = require('axios');
const fs = require('fs');
// DB Models
const Category = require('../models/categories');
const Expense = require('../models/expenses');

const utils = {
  convertCategoryToCSV: async () => {
    const categories = await Category.findAll()
    const { isEmpty } = utils

    let csvData = "category"

    categories.forEach((category) => {
      const { categoryName } = category 
      const value = `\r\n${isEmpty(categoryName)}`
      csvData += value
    })

    fs.writeFileSync("./csvFiles/categoryFile.csv", csvData)
  },
  convertExpenseToCSV: async () => {
    const expenses = await Expense.findAll()
    const { isEmpty } = utils

    let csvData = "userID,amount,currency,location,category,description,month,day,year"

    expenses.forEach((exp) => {
      const { userID, amount, currency, location, description, day, month, year, category } = exp
      const value = `\r\n${isEmpty(userID)},${isEmpty(amount)},${isEmpty(currency)},${isEmpty(location)},${isEmpty(category)},${isEmpty(description)},${isEmpty(day)},${isEmpty(month)},${isEmpty(year)}`
      csvData += value
    })

    fs.writeFileSync("./csvFiles/expensesFile.csv", csvData)
  },
  currencyConversion: async (amount, day, month, year, currency = 'USD') => {
    const formatDay = day >= 10 ? day.toString() : `0${day.toString()}`
    const formatMonth = month >= 10 ? month.toString() : `0${month.toString()}` 
    const historicalDate = `${year}-${formatMonth}-${formatDay}`
    const currencyCode = currency.toUpperCase()

    try{
      const currencyData = await axios.get(`https://openexchangerates.org/api/historical/${historicalDate}.json?app_id=${process.env.openExhangeAPI}`)
      const { rates } = currencyData.data
      // creates USD amount regardless of currency. API has rates based in USD
      const foreignCurrencytoUSD = parseFloat(amount) / rates[currencyCode]
      const convertedAmount = foreignCurrencytoUSD * rates.CAD
      return {
        status: "success",
        amount: convertedAmount.toFixed(2)
      }
    }catch(err){
      return {
        status: "failed",
        amount: NaN 
      }
    }
  },
  insertCategoryToDB: async (data,res) => {
    let counter = {
      successCounter: 0,
      failedCounter: 0
    }
    for (let i = 0; i < data.length; i++) {
      const { category } = data[i]
      try{
        await Category.create({ categoryName: category })
        counter.successCounter++
      }catch(err){
        counter.failedCounter++
      }
    }
    res.send({
      message: `Successfully processed file. Successful: ${counter.successCounter}; Unsuccessful: ${counter.failedCounter}`,
      metaData: counter
    })
  },
  insertExpenseToDB: async (data, res) => {
    let counter = {
      successCounter: 0,
      failedCounter: 0,
      failedValues: []
    }
  
    for (let i = 0; i < data.length; i++) {
      const { userID, amount, description, day, month, year, location, category, currency = 'CAD' } = data[i]
      
      try{
        let convCurr = {}
        
        if(currency !== "CAD"){
          convCurr = await utils.currencyConversion(amount, day, month, year, currency)
        }

        if(convCurr.status === "failed"){ throw new Error("unable to convert currency")}

        await Expense.create({ 
          userID: userID,
          amount: currency === 'CAD' ? amount : convCurr.amount,
          currency: currency,
          category: category,
          location: location,
          description: description,
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year)
        })


        counter.successCounter++
      } catch(err){
        let errorMessage = err.message ? err.message : err.errors[0] 

        counter.failedValues.push({
          id: i + 1,
          message: errorMessage
        })
        counter.failedCounter++
      }
    }
  
    res.send({
      message: `Successfully processed file. Successful: ${counter.successCounter}; Unsuccessful: ${counter.failedCounter}`,
      metaData: counter
    })
  },
  isEmpty: (value) => value ? value : "",
  queryExpenses: async (date) => {
    return await Expense.findAll({ where: date })
  },
  reduceExpensesArray: (array) => {
    const data = []
    for (let i = 0; i < array.length; i++) {
      data.push(Number(array[i].amount))
    }
    return Number((data.reduce(function(a, b) { return a + b; }, 0)).toFixed(2))
  },
  testFunction: async (beginning, end) => {
    // const expenses = await Expense.findAll({ where: { year:  } });
  },
  updatedCategory: (userData, originalCategory) => {
    const { categoryName } = userData
    return {
      categoryName: categoryName ? categoryName : originalCategory[0].categoryName
    }
  },
  updatedExpense: (userData, originalExpense) => {
    const { userID, amount, description, day, month, year, location, expenseID } = userData
    return {
      userID: userID ? userID : originalExpense[0].userID, 
      amount: amount ? amount : originalExpense[0].amount, 
      description: description ? description : originalExpense[0].description, 
      day: day ? day : originalExpense[0].day, 
      month: month ? month : originalExpense[0].month, 
      year: year ? year : originalExpense[0].year, 
      location: location ? location : originalExpense[0].location
    }
  },
} 

module.exports = utils

