'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    title: DataTypes.STRING(1024),
    price: DataTypes.DECIMAL(),
    image01: DataTypes.STRING(2048),
    image02: DataTypes.STRING(2048),
    image03: DataTypes.STRING(2048),
    categoryId: DataTypes.INTEGER(4),
    categoryName : DataTypes.STRING(1024),
    desc: DataTypes.TEXT,
    deleted:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Product;
};