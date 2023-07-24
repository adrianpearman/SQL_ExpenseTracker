// Utility Functions
const {
  convertMonth,
  currencyConversion,
  reduceExpensesArray,
  updatedExpense,
} = require("../utils");
// DB Expense & Category Model
const { Category, Expense, Location, User } = require("../models");

const expenseController = {
  getAllExpenses: async (req, res) => {
    const { userUuid } = req.query;
    try {
      if (!userUuid) {
        throw new Error("Please enter a valid user");
      }

      const user = await User.findOne({ where: { uuid: userUuid } });

      const totalExpenses = await Expense.findAll({
        where: { userId: user.dataValues.id },
      });
      res.send({
        expenseData: {
          amountOfTransactions: totalExpenses.length,
          totalExpenses: totalExpenses,
        },
        message: "Successfully retrieved expenses",
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        expenseData: null,
        message:
          error.message || "An error has occured, unable to retrieve expenses",
        success: false,
      });
    }
  },
  getExpense: async (req, res) => {
    const { expenseUuid, userUuid } = req.query;
    try {
      if (!userUuid) {
        throw new Error("Please enter a valid user");
      }

      const user = await User.findOne({ where: { uuid: userUuid } });

      const expense = await Expense.findOne({
        where: {
          userId: user.dataValues.id,
          uuid: expenseUuid,
        },
      });
      res.send({
        expenseData: expense,
        message: "Successfuly returned expense",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        expenseData: null,
        message: "An error has occured, unable to return expense",
        success: false,
      });
    }
  },
  getExpensePerMonth: async (req, res) => {
    let totalExpenses = 0;
    const returnedData = {};
    const { month, userUuid, year = new Date().getFullYear() } = req.body;
    try {
      if (!userUuid) {
        throw new Error("Please enter a valid user");
      }

      const user = await User.findOne({ where: { uuid: userUuid } });

      const expenses = await Expense.findAll({
        where: {
          month,
          userId: user.dataValues.id,
          year,
        },
      });

      for (let i = 0; i < expenses.length; i++) {
        totalExpenses = totalExpenses + parseFloat(expenses[i].amount);
      }

      returnedData.totalExpenses = Number(totalExpenses.toFixed(2));
      returnedData.amountOfTransactions = expenses.length;
      returnedData.transactions = expenses;
      returnedData.averageExpenditure = Number(
        (totalExpenses / expenses.length).toFixed(2)
      );

      res.send({
        expenseData: returnedData,
        message: "Successfully returned expense data",
        success: true,
      });
    } catch (error) {
      res.status().send({
        expenseData: null,
        message: "An error has occured",
        success: false,
      });
    }
  },
  getExpensePerYear: async (req, res) => {
    const { userUuid, year = new Date().getFullYear() } = req.query;
    const returnedData = {};

    try {
      if (!userUuid) {
        throw new Error("Please enter a valid user");
      }

      const user = await User.findOne({ where: { uuid: userUuid } });

      const expenses = await Expense.findAll({
        where: {
          userId: user.dataValues.id,
          year,
        },
      });

      for (let i = 0; i < expenses.length; i++) {
        const element = expenses[i];
        const month = convertMonth(element.month);

        if (returnedData[month] === undefined) {
          returnedData[month] = {
            transactions: [Number(element.amount)],
            averages: element.amount,
            totalExpenses: 1,
          };
        } else {
          const expenseItem = returnedData[month];
          expenseItem.transactions.push(Number(element.amount));
          const averageTransaction =
            expenseItem.transactions.reduce(function (a, b) {
              return a + b;
            }, 0) / expenseItem.transactions.length;
          expenseItem.averages = Number(averageTransaction.toFixed(2));
          expenseItem.totalExpenses++;
        }
      }

      const reducedArrayData = reduceExpensesArray(expenses);

      returnedData.totalNumberOfExpenses = expenses.length;
      returnedData.totalExpense = reducedArrayData;
      returnedData.averageTransaction = Number(
        (reducedArrayData / expenses.length).toFixed(2)
      );

      res.send({
        expenseData: returnedData,
        message: "Successfully returned expense data",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        expenseData: null,
        message: "An error has occured, unable to return expense",
        success: false,
      });
    }
  },
  getExpensePerLocation: async (req, res) => {
    const { locationId, userUuid } = req.query;
    const returnedData = {};

    try {
      if (!locationId) {
        throw new Error("Please enter a valid location");
      } else if (!userUuid) {
        throw new Error("Please enter a valid user");
      }

      const user = await User.findOne({ where: { uuid: userUuid } });

      const location = await Location.findOne({
        where: {
          id: locationId,
        },
        include: {
          as: "expenses",
          model: Expense,
          where: { userId: user.dataValues.id },
        },
      });

      const expenses = location.dataValues.expenses;

      if (expenses.length !== 0) {
        const formattedArray = expenses.map((exp) => exp.dataValues);
        const reducedArrayData = reduceExpensesArray(formattedArray);
        returnedData.expenses = expenses;
        returnedData.totalNumberOfExpenses = expenses.length;
        returnedData.location = location.location;
        returnedData.totalExpense = reducedArrayData;
        returnedData.averageTransaction = Number(
          (reducedArrayData / expenses.length).toFixed(2)
        );
      } else {
        const reducedArrayData = reduceExpensesArray([]);
        returnedData.expenses = [];
        returnedData.totalNumberOfExpenses = 0;
        returnedData.location = location.location;
        returnedData.totalExpense = reducedArrayData;
        returnedData.averageTransaction = Number(
          (reducedArrayData / expenses.length).toFixed(2)
        );
      }

      res.json({
        expenseData: returnedData,
        message: "Successfully returned expenseData",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        expenseData: null,
        message: `An error has occured: ${error.message}`,
        success: false,
      });
    }
  },
  getExpensesPerCategory: async (req, res) => {
    const { categoryId, userUuid } = req.query;
    const returnedData = {};

    try {
      if (!userUuid) {
        throw new Error("Please enter a valid user");
      }

      const user = await User.findOne({ where: { uuid: userUuid } });

      const category = await Category.findOne({
        where: { id: categoryId },
        include: {
          as: "expenses",
          model: Expense,
          where: {
            userId: user.dataValues.id,
          },
        },
      });

      const expenses = category.dataValues.expenses.map(
        (exp) => exp.dataValues
      );

      const reducedArrayData = reduceExpensesArray(expenses);

      returnedData.category = category.dataValues.categoryName;
      returnedData.expenses = expenses;
      returnedData.totalNumberOfExpenses = expenses.length;
      returnedData.totalExpense = reducedArrayData;
      returnedData.averageTransaction = Number(
        (reducedArrayData / expenses.length).toFixed(2)
      );

      res.send({
        expenseData: returnedData,
        message: "Successfully returned expenseData",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        expenseData: null,
        message:
          error.message || "An error has occured, unable to retrieve category",
        success: false,
      });
    }
  },
  addExpense: async (req, res) => {
    const {
      userUuid,
      amount,
      category,
      currency = "CAD",
      description,
      day,
      location,
      month,
      year,
    } = req.body;

    try {
      const convCurr = await currencyConversion(
        amount,
        currency,
        day,
        month,
        year
      );

      if (convCurr.status === "failed") {
        throw new Error("Error occured at currency conversion");
      }

      const locationFromDB = await Location.findOne({
        where: { location: location },
      });

      const user = await User.findOne({ where: { uuid: userUuid } });

      let locationId;

      if (locationFromDB === null) {
        const newLocation = await Location.create({
          location: location,
        });
        locationId = newLocation.dataValues.id;
      } else {
        locationId = locationFromDB.dataValues.id;
      }

      const expense = await Expense.create({
        userId: user.dataValues.id,
        amount: currency === "CAD" ? amount : convCurr.amount,
        categoryId: parseInt(category),
        currency: currency,
        day: parseInt(day),
        description: description,
        locationId: locationId,
        month: parseInt(month),
        year: parseInt(year),
      });

      return res.send({
        expense: expense,
        message: "Successfully added expense",
        success: true,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        expense: expense,
        message: err,
        success: false,
      });
    }
  },

  // todo revise options for updating
  updateExpense: async (req, res) => {
    const { expenseID } = req.body;

    try {
      const originalExpense = await Expense.findAll({
        where: { expenseID: expenseID },
      });

      const updatedExpenseData = updatedExpense(req.body, originalExpense);

      await Expense.update(updatedExpenseData, {
        where: { expenseID: expenseID },
      });
      res.send({ message: `Successfully updated Expense: #${expenseID}` });
    } catch (err) {
      res.send({ err: `Unable to find Expense: #${expenseID}` });
    }
  },
  // todo

  deleteExpense: async (req, res) => {
    const { expenseUuid, userUuid } = req.query;

    try {
      if (!userUuid) {
        throw new Error("User is invalid, please enter a user");
      }

      const user = await User.findOne({
        where: { uuid: userUuid },
      });

      const expense = await Expense.destroy({
        where: {
          userId: user.dataValues.id,
          uuid: expenseUuid,
        },
      });

      res.send({
        expenseData: expense,
        message: `Successfully deleted ExpenseID: ${expenseUuid}`,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        expenseData: null,
        message:
          error.message ||
          `An error has occured, unable to delete Expense: ${expenseUuid}`,
        success: false,
      });
    }
  },
  deleteAllExpenses: async (req, res) => {
    const { userUuid } = req.query;

    try {
      if (!userUuid) {
        throw new Error("User is invalid, please enter a user");
      }

      const user = await User.findOne({
        where: { uuid: userUuid },
      });

      // Will need to add some logic to make this an admin function
      // API Key?
      await Expense.destroy({
        where: {
          userId: user.dataValues.id,
        },
      });

      res.send({
        message: `Successfully Cleared Expense Database for User: ${user.dataValues.id}`,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "An error has occured",
        success: false,
      });
    }
  },
};

module.exports = expenseController;
