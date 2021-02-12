'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersInformation extends Model {
    static associate(models) {
      UsersInformation.hasMany(models.NINPhoneRecord,{
          foreignKey : 'NIN',
          as : 'NINPhone'
      });

      UsersInformation.hasMany(models.WalletTransaction,{
          foreignKey : 'NIN',
          as : 'WalletTransaction'
      });
    }
  };
  UsersInformation.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      unique:true,
      type: DataTypes.INTEGER
    },
    firstName: {type: DataTypes.STRING(80),allowNull: false},
    lastName: {type: DataTypes.STRING(80),allowNull: false},
    walletAmount: {type: DataTypes.DECIMAL(15, 2) ,defaultValue: 0},
    NIN: {type: DataTypes.STRING(11),primaryKey: true,allowNull: false},
  }, {
    sequelize,
    modelName: 'UsersInformation',
    tableName: "UsersInformations",
    timestamps:true
  });
  return UsersInformation;
};