// NPM Modules
const { isAdminUser, updatedCategory } = require("../utils");
// DB Expense Model
const { Category } = require("../models");

const categoryController = {
  addCategory: async (req, res) => {
    const { categoryName, userUuid } = req.body;
    try {
      if (!categoryName) {
        throw new Error("Missing ctaegory name, please enter a category");
      } else if (!userUuid) {
        throw new Error("Unauthorized, missing user details");
      }

      if (!(await isAdminUser(userUuid))) {
        throw new Error("Unauthorized, invalid role access level");
      }

      const category = await Category.create({ categoryName: categoryName });

      return res.send({
        category: category,
        message: "Successfully added category",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        category: null,
        message: error.message,
        success: false,
      });
    }
  },
  deleteCategory: async (req, res) => {
    const { categoryId, userUuid } = req.body;

    try {
      if (!userUuid) {
        throw new Error("Unauthorized, missing user details");
      }

      if (!(await isAdminUser(userUuid))) {
        throw new Error("Unauthorized, invalid role access level");
      }

      const category = await Category.destroy({
        where: { categoryId: categoryId },
      });

      if (category !== 0) {
        res.send({
          message: `Successfully deleted ExpenseID: ${categoryId}`,
          success: true,
        });
      } else {
        throw new Error(
          `No Category available with the ExpenseID of ${categoryId}`
        );
      }
    } catch (error) {
      res.status(500).send({
        message: error.message || "An error has occured, try again later",
        success: false,
      });
    }
  },
  deleteAllCategories: async (req, res) => {
    try {
      // Will need to add some logic to make this an admin function
      // API Key?
      await Category.drop();
      await Category.sync({ force: true });
      res.send({
        message: "Successfully Cleared Category Database",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "An error has occured",
        success: false,
      });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const values = await Category.findAll({});
      res.send({
        categories: values,
        message: "Successfully retrieved categories",
        success: true,
      });
    } catch (err) {
      res.status(500).send({
        category: null,
        message: error,
        success: false,
      });
    }
  },
  updateCategory: async (req, res) => {
    const { categoryId, userUuid } = req.body;
    try {
      if (!categoryId) {
        throw new Error("Missing ctaegory name, please enter a category");
      } else if (!userUuid) {
        throw new Error("Unauthorized, missing user details");
      }

      if (!(await isAdminUser(userUuid))) {
        throw new Error("Unauthorized, invalid role access level");
      }

      const originalCategory = await Category.findAll({
        where: { categoryId: categoryId },
      });

      const updatedCategoryData = await Category.update(
        updatedCategory(req.body, originalCategory),
        {
          where: { categoryId: categoryId },
        }
      );
      res.send({
        category: updatedCategoryData,
        message: `Successfully updated Category: #${categoryId}`,
        success: true,
      });
    } catch (err) {
      res.status(500).send({
        category: null,
        message: `Unable to find Category: #${categoryId}`,
        success: false,
      });
    }
  },
};

module.exports = categoryController;
