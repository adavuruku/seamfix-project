'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NINPhoneRecord extends Model {
    static associate(models) {
      NINPhoneRecord.belongsTo(models.UsersInformation, { as: 'UserInfo', foreignKey: 'NIN' });
      NINPhoneRecord.hasOne(models.WalletTransaction, { as: 'PaymentInfo', foreignKey: 'OperationID' });
    }
  };
  NINPhoneRecord.init({
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
    PhoneNumber: {type: DataTypes.STRING(11),unique: true,allowNull: false},
    status: {type: DataTypes.BOOLEAN, defaultValue:false},
    token: {type: DataTypes.STRING,allowNull: false},
    tokenExpiredDate: {allowNull: false, type: DataTypes.DATE},
  }, {
    sequelize,
    modelName: 'NINPhoneRecord',
    tableName: "NINPhoneRecords",
    timestamps:true
  });
  return NINPhoneRecord;
};