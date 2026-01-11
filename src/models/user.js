"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [20, 60],
            msg: "Name must be between 20 and 60 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 400],
        },
      },
      role: {
        type: DataTypes.ENUM("system_admin", "normal_user", "store_owner"),
        allowNull: false,
        defaultValue: "normal_user",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
