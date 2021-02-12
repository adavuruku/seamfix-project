'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WalletTransaction extends Model {
    static associate(models) {
      WalletTransaction.belongsTo(models.UsersInformation, { as: 'UserInfo', foreignKey: 'NIN' });
      WalletTransaction.belongsTo(models.NINPhoneRecord, { as: 'LinkRecord', foreignKey: 'OperationID' });
    }
  };
  WalletTransaction.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    NIN: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    OperationID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    previousAmount: {type: DataTypes.DECIMAL(15, 2) ,allowNull: false},
    currentAmount: {type: DataTypes.DECIMAL(15, 2) ,allowNull: false},
    amountPaid: {type: DataTypes.DECIMAL(15, 2) ,allowNull: false},
    transactionType: {type: DataTypes.ENUM(['Credit', 'Debit']) , defaultValue: 'Credit'},
  }, {
    sequelize,
    modelName: 'WalletTransaction',
    tableName: "WalletTransactions",
    timestamps:true
  });
  return WalletTransaction;
};