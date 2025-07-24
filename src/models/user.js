const sequelize = require("sequelize");
const { db } = require("../config/db");
const { Project } = require("./project");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");
//User is model name and in db  Users  table is created automatically if you not give table name
const User = db.define(
  "User",
  {
    name: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    user_type: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tablename: "Users",
  }
);

module.exports = { User };
