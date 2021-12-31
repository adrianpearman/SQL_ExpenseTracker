const sequelize = require('../database')

const adminController = {
  resetDatabase: async(req, res) => {
    try{
      await sequelize.sync({ force: true })
      console.log("All models were synchronized successfully.")
      res.send({ message: "All models were synchronized successfully."})
    }catch(err){}
      console.log(err)
      res.send({ errMsg: err })
  }
}

module.exports = adminController