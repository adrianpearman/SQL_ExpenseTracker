// NPM Modules
const csv = require('csv-parser');
const fs = require('fs');
// DB Expense Model
const Category = require('../models/categories')

const categoryController = {
  getAllCategories: async(req, res) => {
    try{
      const values = await Category.findAll({})
      res.send({ categories: values })
    }catch(err){
      throw err
    }
    
  },
  addCategory: async(req, res) => {
    const { categoryName } = req.query
     try{
      await Category.create({ categoryName })
      return res.send({message: "Successfully added Category"})
    }catch(err){
      res.send({error: err})
    }
  },
  bulkAddCategories: async (req, res) => {
    const categoryList = []
    const insertCategoryToDB = async (data) => {
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
    }

    fs.createReadStream('./csvFiles/categoryFile.csv')
      .pipe(csv())
      .on('data', (row) => {
        categoryList.push(row)
      })
      .on('end', () => {
        insertCategoryToDB(categoryList)
      });
  },
  updateCategory: async (req, res) => {},
  deleteCategory: async (req, res) => {
    const { categoryID } = req.query
    const category = await Category.destroy({
      where: { categoryID: categoryID }
    })

    if(category !== 0){
      res.send({ message: `Successfully deleted ExpenseID: ${categoryID}` })
    } else{
      res.send({ message: `No Category available with the ExpenseID of ${categoryID}` })  
    }
  },
  deleteAllCategories: async (req, res) => {
    // Will need to add some logic to make this an admin function
    // API Key? 
    await Category.drop()
    await Category.sync({ force: true });
    res.send({message: "Successfully Cleared Database"})
  }
}

module.exports = categoryController