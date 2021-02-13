'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UsersInformations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique:true,
        type: Sequelize.INTEGER
      },
      firstName: {type: Sequelize.STRING(80),allowNull: false},
      lastName: {type: Sequelize.STRING(80),allowNull: false},
      walletAmount: {type: Sequelize.DECIMAL(15, 2) ,defaultValue: 0},
      NIN: {type: Sequelize.STRING(15),primaryKey: true,allowNull: false},
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UsersInformations');
  }
};