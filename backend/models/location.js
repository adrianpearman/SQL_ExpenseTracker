"use strict";
const { Model } = require("sequelize");
const Expense = require("./expense");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate({ Expense }) {
      // define association here
      this.hasMany(Expense, { foreignKey: "locationId", as: "expenses" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Location.init(
    {
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "locations",
      modelName: "Location",
    }
  );

  return Location;
};
