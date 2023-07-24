"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "users";
    await queryInterface.bulkInsert(
      tableName,
      [
        {
          uuid: "47b4cb50-4648-4722-8ec8-6d14befaa30b",
          firstName: "adrian",
          lastName: "pearman",
          email: "test@test.com",
          roleId: 1,
          updatedAt: "2023-07-20T04:08:40.114Z",
          createdAt: "2023-07-20T04:08:40.114Z",
        },
        {
          uuid: "47b4cb50-4648-4722-8ec8-6d16befaa31b",
          firstName: "nairda",
          lastName: "ben",
          email: "test12@test.com",
          roleId: 2,
          updatedAt: "2023-07-22T04:08:40.114Z",
          createdAt: "2023-07-22T04:08:40.114Z",
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
    await queryInterface.bulkDelete("users", null, {});
  },
};
