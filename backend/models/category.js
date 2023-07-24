"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate({ Expense }) {
      // define association here
      this.hasMany(Expense, { foreignKey: "categoryId", as: "expenses" });
    }
  }
  Category.init(
    {
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "categories",
      modelName: "Category",
    }
  );
  return Category;
};
