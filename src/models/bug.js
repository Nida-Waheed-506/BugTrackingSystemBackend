const sequelize = require("sequelize");
const { db } = require("../config/db");

const Bug = db.define(
  "Bug",
  {
    bugCounter: {
      type: sequelize.DataTypes.INTEGER,
    },
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
      defaultValue: "new",
      values: ["new", "started", "completed", "resolved"],
    },
    project_id: {
      type: sequelize.DataTypes.INTEGER,
    },
    QA_id: {
      type: sequelize.DataTypes.INTEGER,
    },
    developer_id: {
      type: sequelize.DataTypes.ARRAY(sequelize.DataTypes.STRING),
    },
  },
  { tablename: "Bugs" }
);

Bug.beforeCreate(async (bug) => {
  const maxBug = await Bug.findOne({
    where: { project_id: bug.project_id },
    order: [["bugCounter", "DESC"]],
  });

  bug.bugCounter = maxBug ? maxBug.bugCounter + 1 : 1;
});

module.exports = { Bug };
