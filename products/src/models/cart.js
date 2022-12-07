'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cart.init({
    userId: DataTypes.INTEGER,
    product: DataTypes.TEXT,
    fullName: DataTypes.STRING(1024),
    email: DataTypes.STRING(1024),
    phoneNumber: DataTypes.STRING(1024),
    address:DataTypes.STRING(2048),
    status: DataTypes.INTEGER,
    subPrice: DataTypes.DECIMAL,
    shipping: DataTypes.DECIMAL,
    totalPrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Carts',
  });
  return Cart;
};