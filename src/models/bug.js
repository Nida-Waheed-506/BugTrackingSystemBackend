const sequelize = require("sequelize");
const { db } = require("../config/db");

const Bug = db.define(
  "Bug",
  {
    title: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    deadline: {
      type: sequelize.DataTypes.DATEONLY,
      validate: {
        customValidator(value) {
          if (new Date(value) <= new Date()) {
            throw new Error("invalid date");
          }
        },
      },
    },
    screenshot: {
      type: sequelize.DataTypes.BLOB(),
      allowNull: true,
    },
    type: {
      type: sequelize.DataTypes.ENUM,
      values: ["feature", "bug"],
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: sequelize.DataTypes.ENUM,
      default: "new",
      values: ["new", "started", "completed", "resolved"],
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    project_id: {
      type: sequelize.DataTypes.INTEGER,
    },
    QA_id: {
      type: sequelize.DataTypes.STRING,
    },
    developer_id: {
      type: sequelize.DataTypes.STRING,
    },
  },
  { tablename: "Bugs" }
);

module.exports = { Bug };
