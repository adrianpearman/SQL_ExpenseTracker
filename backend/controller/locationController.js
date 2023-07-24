const { Location } = require("../models");

const locationController = {
  getAllLocations: async (req, res) => {
    try {
      const locations = await Location.findAll({});

      res.send({
        locationData: locations,
        message: "Successfully returned locations",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        expenseData: null,
        message: "An error has occured, unable to retrieve locations",
        success: false,
      });
    }
  },
};

module.exports = locationController;
