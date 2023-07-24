// NPM Modules
const { errorHandlerMessage, sequelizeConfig } = require("../utils");
// DB User Model
const { User } = require("../models");

const userController = {
  createUser: async (req, res) => {
    const { firstName, lastName, email } = req.body;
    try {
      const user = await User.create({ firstName, lastName, email });
      res.send({
        message: "Successfully created a new user",
        success: true,
        user: user,
      });
    } catch (err) {
      return res.status(500).json({
        message: errorHandlerMessage(err),
        success: false,
        user: null,
      });
    }
  },
  deleteUser: () => {},
  getUser: async (req, res) => {
    const { userUuid } = req.query;
    try {
      const user = await User.findOne({ where: { uuid: userUuid } });

      if (user !== null) {
        res.send({
          message: "",
          success: true,
          user: user,
        });
      } else {
        res.status(400).send({
          message: `No user with the ID of ${userUuid}`,
          success: false,
          user: null,
        });
      }
    } catch (err) {
      res.status(400).send({
        message: "An error has occured, please try again",
        success: false,
        user: null,
      });
    }
  },
  deleteUsers: async (req, res) => {
    await User.drop();
    await User.sync({ force: true });
    res.send({ message: "Successfully Cleared User Database" });
  },
  resetDatabase: async (req, res) => {
    try {
      await sequelizeConfig().sync({ force: true });
      console.log("All models were synchronized successfully.");
      res.send({ message: "All models were synchronized successfully." });
    } catch (err) {
      console.log(err);
      res.send({ errMsg: err });
    }
  },
  updateUser: () => {},
};

module.exports = userController;
