'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      product: {
        type: Sequelize.TEXT
      },
      fullName: {
        type: Sequelize.STRING(1024)
      },
      email: {
        type: Sequelize.STRING(1024)
      },
      phoneNumber: {
        type: Sequelize.STRING(1024)
      },
      address: {
        type: Sequelize.STRING(2048)
      },
      shipping: {
        type: Sequelize.DECIMAL
      },
      subPrice: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};