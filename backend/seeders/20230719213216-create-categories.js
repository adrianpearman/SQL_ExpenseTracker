"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "categories";
    await queryInterface.bulkInsert(
      tableName,
      [
        {
          id: 1,
          categoryName: "Groceries",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 2,
          categoryName: "Pharmacy",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 3,
          categoryName: "Alcohol/Liquor",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 4,
          categoryName: "Restaurant",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 5,
          categoryName: "Takeout Food",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 6,
          categoryName: "Hardware",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 7,
          categoryName: "Transit",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 8,
          categoryName: "Clothes Shopping",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 9,
          categoryName: "Travelling",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 10,
          categoryName: "Golf",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 11,
          categoryName: "Electronics",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
        {
          id: 12,
          categoryName: "Misc",
          updatedAt: "2023-07-19T21:41:58.938Z",
          createdAt: "2023-07-19T21:41:58.938Z",
        },
      ],
      {}
    );
    // This is need to update index post seed insertion
    await queryInterface.sequelize.query(
      `SELECT setval('${tableName}_id_seq', max(id)) FROM ${tableName};`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
