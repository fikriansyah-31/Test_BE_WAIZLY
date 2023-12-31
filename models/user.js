'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser",
        },
      });

      user.hasMany(models.product, {
        as: "product",
        foreignKey: {
          name: "idUser",
        },
      });

      user.hasMany(models.transaction, {
        as: "buyerTransactions",
        foreignKey: {
          name: "idBuyer",
        },
      });

      user.hasMany(models.transaction, {
        as: "sellerTransactions",
        foreignKey: {
          name: "idSeller",
        },
      });

    }
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};