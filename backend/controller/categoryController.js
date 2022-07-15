// NPM Modules
const { updatedCategory } = require('../utils')
// DB Expense Model
const Category = require('../models/categories')

const categoryController = {
  addCategory: async(req, res) => {
    const { categoryName } = req.body
    try{
      await Category.create({ categoryName: categoryName })
      return res.send({message: "Successfully added Category"})
    }catch(err){
      res.send({error: err})
    }
  },
  deleteCategory: async (req, res) => {
    const { categoryID } = req.body
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
    res.send({message: "Successfully Cleared Category Database"})
  },
  getAllCategories: async(req, res) => {
    try{
      const values = await Category.findAll({})
      res.send({ categories: values })
    }catch(err){
      throw err
    }
  },
  updateCategory: async (req, res) => {
    const { categoryID } = req.body
    try{
      const originalCategory = await Category.findAll({ where: { categoryID: categoryID }})
      const updatedCategoryData = updatedCategory(req.body, originalCategory)
      await Category.update(  
        updatedCategoryData,
        { where: { categoryID: categoryID } }
      )
      res.send({ data: updatedCategory })
    }catch(err){
        res.send({ err: `Unable to find Category: #${categoryID}`})
    }
  },
}

module.exports = categoryController