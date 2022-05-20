'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 5,
        notNull: {
          msg: 'Please enter your name'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      required: [true, "email not provided"],
      validate: {
        isEmail: {
          msg: 'Please enter a valid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      },
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};