// NPM Modules
const sequelize = require('../database')
// DB User Model
const User = require('../models/users')

const userController = {
  createUser: async (req, res) => {
   
  },
  deleteUser: () => {},
  getUser: async (req, res) => {
    const { userID } = req.body
    try {
      const user = await User.findAll({ where: { userID: userID }})

      if(user.length > 0){
        res.send({ user: user })
      } else {
        res.send({ message: `No user with the ID of ${ userID }`})
      }
    } catch (err){
      res.send({ err: "An error has occured" })
    }
  },
  deleteUsers: async (req, res) => {
    await User.drop()
    await User.sync({ force: true })
    res.send({ message: "Successfully Cleared User Database"})
  },
  resetDatabase: async(req, res) => {
    try{
      await sequelize.sync({ force: true })
      console.log("All models were synchronized successfully.")
      res.send({ message: "All models were synchronized successfully."})
    }catch(err){}
    console.log(err)
    res.send({ errMsg: err })
  },
  updateUser: () => {},
}

module.exports = userController