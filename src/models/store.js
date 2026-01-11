'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      // Defined relationship: Store belongs to User
      this.belongsTo(models.User, { foreignKey: 'ownerId' });
    }
  }
  Store.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [20, 60]
        }
      },
      email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
        validate: {
            isEmail: true
        }
      },
      address: {
        type: DataTypes.STRING(400),
        allowNull: false,
        validate: {
            len: [10, 400]
        }
      },
      rating:{
        type:DataTypes.DECIMAL(3,2),
        allowNull:false,
        defaultValue:0.00,
        validate:{
          min:0.00,
          max:5.00
        }
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};