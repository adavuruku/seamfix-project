'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NINPhoneRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NIN: {
        type: Sequelize.DataTypes.STRING(11),
        references: {
          model: {
            tableName: 'UsersInformations'
          },
          key: 'NIN'
        },
        allowNull: false
      },
      PhoneNumber: {type: Sequelize.STRING(11),unique: true,allowNull: false},
      status: {type: Sequelize.BOOLEAN, defaultValue:false},
      token: {type: Sequelize.STRING,allowNull: false},
      tokenExpiredDate: {allowNull: false, type: Sequelize.DATE},
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
    await queryInterface.dropTable('NINPhoneRecords');
  }
};