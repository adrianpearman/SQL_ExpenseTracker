"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "expenses";
    await queryInterface.bulkInsert(tableName, [
      {
        id: 1,
        uuid: "bcd1c273-83ed-4e3d-839f-8bc5922b474d",
        amount: "100.00",
        currency: "CAD",
        description: "Champagne!",
        day: 19,
        locationId: 1,
        month: 7,
        year: 2023,
        createdAt: "2023-07-20T15:10:15.433Z",
        updatedAt: "2023-07-20T15:10:15.433Z",
        categoryId: 1,
        userId: 1,
      },
      {
        id: 2,
        uuid: "7961d797-82fe-47f1-92c8-26067d685c8a",
        amount: "50.45",
        currency: "CAD",
        description: "",
        day: 10,
        locationId: 1,
        month: 7,
        year: 2023,
        createdAt: "2023-07-20T17:54:43.819Z",
        updatedAt: "2023-07-20T17:54:43.819Z",
        categoryId: 1,
        userId: 1,
      },
    ]);
    // This is need to update index post seed insertion
    await queryInterface.sequelize.query(
      `SELECT setval('${tableName}_id_seq', max(id)) FROM ${tableName};`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("expenses", null, {});
  },
};
