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
      phoneNumber: {type: Sequelize.STRING(15),unique:true,allowNull: false},
      status: {type: Sequelize.BOOLEAN, defaultValue:false},
      token: {type: Sequelize.STRING,allowNull: false},
      tokenExpiredDate: {allowNull: false, type: Sequelize.STRING},
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