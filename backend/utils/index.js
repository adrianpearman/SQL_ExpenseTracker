const Expense = require('../models/expenses') ;
const Category = require('../models/categories') ;

module.exports = {
  insertCategoryToDB: async (data,res) => {
    let counter = {
      successCounter: 0,
      failedCounter: 0
    }
    for (let i = 0; i < data.length; i++) {
      const { categoryName } = data[i]
      try{
        await Category.create({ categoryName })
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
      failedCounter: 0
    }
  
    for (let i = 0; i < data.length; i++) {
      const { userID, amount, description, day, month, year, location, category } = data[i]
      
      try{
        await Expense.create({ 
          userID: userID,
          amount: amount,
          location: location,
          category: category,
          description: description,
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year)
        })
        counter.successCounter++
      } catch(err){
        counter.failedCounter++
      }
    }
  
    res.send({
      message: `Successfully processed file. Successful: ${counter.successCounter}; Unsuccessful: ${counter.failedCounter}`,
      metaData: counter
    })
  },
  reduceExpensesArray: (array) => {
    const data = []
    for (let i = 0; i < array.length; i++) {
      data.push(Number(array[i].amount))
    }
    return Number((data.reduce(function(a, b) { return a + b; }, 0)).toFixed(2))
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

