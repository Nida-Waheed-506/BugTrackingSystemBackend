const { Project } = require("../models/project");
const { User } = require("../models/user");
const { Bug } = require("../models/bug");
const { Op } = require("sequelize");
const { user_types } = require("../utils/constants");
// +++++++++++++++++++++++++++ imports end ++++++++++++++++++++++++++++++++++++++++

class ProjectHandlers {
  createProject = async (projectData, image, loggedInUserData) => {
    const { projectName, projectDes, taskDone } = projectData;

    const { id } = loggedInUserData;

    const project = await Project.create({
      projectName: projectName,
      projectDes: projectDes,
      manager_id: id,
      taskDone: taskDone,
      image: image,
    });

    return project;
  };

  findProjects = async (limit, offset) => {
    const { count, rows } = await Project.findAndCountAll({
      distinct: true,
      limit,
      offset,
      include: [{ model: Bug }],
    });

    return { count, rows };
  };

  findProject = async (id) => {
    const project = await Project.findOne({
      where: { id: id },
    });

    return project;
  };

  getProject = async (project_id) => {
    return await Project.findOne({ where: { id: project_id } });
  };

  updateProject = async (project, projectData) => {
    const { projectName, projectDes, taskDone } = projectData;

    const updatedProject = await project.update({
      projectName: projectName,
      projectDes: projectDes,
      taskDone,
    });

    return await updatedProject.save();
  };

  deleteProject = async (project) => {
    return await project.destroy();
  };

  isProjectManager = async (project, manager_id) => {
    return project.manager_id === manager_id;
  };

  projectAssign = async (project, user) => {
    // assign user to a project
    return await project.addUser(user);
  };

  // top developers
  findUsersDevsTop = async (project, limit) => {
    const devs = await project.getUsers({
      where: { user_type: user_types.developer },
      limit: limit,
    });

    return devs;
  };

  //  developer search by name

  findUsersDevs = async (project, searchingName) => {
    const devs = await project.getUsers({
      where: {
        name: { [Op.iLike]: `%${searchingName}%` },
        user_type: user_types.developer,
      },
      limit: 2,
    });

    return devs;
  };
}

const projectHandlers = new ProjectHandlers();

module.exports = {
  projectHandlers,
};
