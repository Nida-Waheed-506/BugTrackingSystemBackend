const { User } = require("./user");
const { Project } = require("./project");
const { Bug } = require("./bug");



// user and project :: many to many relation

User.belongsToMany(Project, { through: "UserProject" });
Project.belongsToMany(User, {
  through: "UserProject",
});


// user and project :: one to many relation

User.hasMany(Project, { foreignKey: "manager_id"  , as : "managedProjects"});
Project.belongsTo(User, { foreignKey: "manager_id" , as : "manager" });



// project and bug :: one to many relation

Project.hasMany(Bug, { foreignKey: "project_id" });
Bug.belongsTo(Project, { foreignKey: "project_id" });

// user and bug :: many to many relation
