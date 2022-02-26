// NPM Modules
const csv = require('csv-parser');
const fs = require('fs');
const { insertCategoryToDB, updatedCategory } = require('../utils')
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
    fs.createReadStream('./csvFiles/categoryFile.csv')
      .pipe(csv())
      .on('data', (row) => {
        categoryList.push(row)
      })
      .on('end', () => {
        insertCategoryToDB(categoryList, res)
      });
  },
  updateCategory: async (req, res) => {
    const { categoryID } = req.query
    try{
      const originalCategory = await Category.findAll({ where: { categoryID: categoryID }})
      const updatedCategoryData = updatedCategory(req.query, originalCategory)
      await Category.update(  
        updatedCategoryData,
        { where: { categoryID: categoryID } }
      )
      res.send({ data: updatedCategory })
    }catch(err){
        res.send({ err: `Unable to find Category: #${categoryID}`})
    }
  },
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