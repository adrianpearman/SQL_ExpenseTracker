"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "roles";
    await queryInterface.bulkInsert(tableName, [
      {
        id: 1,
        role: "Admin",
        updatedAt: "2023-07-19T21:41:58.938Z",
        createdAt: "2023-07-19T21:41:58.938Z",
      },
      {
        id: 2,
        role: "User",
        updatedAt: "2023-07-19T21:41:58.938Z",
        createdAt: "2023-07-19T21:41:58.938Z",
      },
    ]);
    // This is need to update index post seed insertion
    await queryInterface.sequelize.query(
      `SELECT setval('${tableName}_id_seq', max(id)) FROM ${tableName};`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
