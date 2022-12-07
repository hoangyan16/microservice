'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(4)
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(1024)
      },
      price: {
        allowNull : false,
        type: Sequelize.DECIMAL(),
      },
      image01: {
        type: Sequelize.STRING(2048)
      },
      image02: {
        type: Sequelize.STRING(2048)
      },
      image03: {
        type: Sequelize.STRING(2048)
      },
      desc: {
        type: Sequelize.TEXT
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER(4)
      },
      categoryName: {
        type: Sequelize.STRING(1024)
      },
      deleted: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Products');
  }
};