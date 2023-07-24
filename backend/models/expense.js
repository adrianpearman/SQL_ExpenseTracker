"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate({ Category, Location, User }) {
      // define association here
      this.belongsTo(Category, { foreignKey: "categoryId" });
      this.belongsTo(Location, { foreignKey: "locationId" });
      this.belongsTo(User, { foreignKey: "userId" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Expense.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "expenses",
      modelName: "Expense",
    }
  );
  return Expense;
};
