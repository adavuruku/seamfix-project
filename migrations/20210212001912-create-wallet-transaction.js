'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WalletTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NIN: {
        type: Sequelize.STRING(15),
        references: {
          model: {
            tableName: 'UsersInformations'
          },
          key: 'NIN'
        },
        allowNull: false
      },
      OperationID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'NINPhoneRecords'
          },
          key: 'id'
        },
        allowNull: true
      },
      previousAmount: {type: Sequelize.DECIMAL(15, 2) ,allowNull: false},
      currentAmount: {type: Sequelize.DECIMAL(15, 2) ,allowNull: false},
      amountPaid: {type: Sequelize.DECIMAL(15, 2) ,allowNull: false},
      transactionType: {type: Sequelize.ENUM(['Credit', 'Debit']) , defaultValue: 'Credit'},
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
    await queryInterface.dropTable('WalletTransactions');
  }
};