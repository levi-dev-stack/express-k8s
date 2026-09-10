"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("users", [
      {
        name: "Nofil",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ali",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Basit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
