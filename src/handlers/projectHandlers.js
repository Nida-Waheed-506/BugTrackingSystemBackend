const { Project } = require("../models/project");
const { User } = require("../models/user");
const { Op } = require("sequelize");
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

    await loggedInUserData.addProject(project);
    return project;
  };

  findProjects = async () => {
    const projects = await Project.findAll({
      attributes: [
        "id",
        "projectName",
        "projectDes",
        "taskDone",
        "manager_id",
        "image",
      ],
    });

    return projects.map((project) => {
      const projectJSON = project.toJSON();

      if (projectJSON.image) {
        projectJSON.image = projectJSON.image.toString("base64");
      }

      return projectJSON;
    });
  };

  updateProject = async (projectId, manager_id, projectData) => {
    const project = await Project.findOne({
      where: { id: projectId, manager_id: manager_id },
    });

    if (!project) throw new Error("You not create this project");

    const { projectName, projectDes, taskDone } = projectData;

    const updatedProject = await project.update({
      projectName: projectName,
      projectDes: projectDes,
      taskDone,
    });

    return await updatedProject.save();
  };

  deleteProject = async (projectId, manager_id) => {
    const project = await Project.findOne({
      where: { id: projectId, manager_id: manager_id },
    });
    if (!project) throw new Error("You not create this project");

    return await project.destroy();
  };

  getProject = async (project_id) => {
    console.log(project_id, typeof project_id);
    return await Project.findOne({ where: { id: project_id } });
  };
  projectAssign = async (manager_id, project_id, email) => {
    console.log(typeof project_id);
    // find project exists or not

    const project = await Project.findOne({ where: { id: project_id } });
    if (!project) throw new Error("Project does not exist");

    // find user exists or not
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new Error("User not exists");

    //  find user is QA or developer

    if (user.user_type !== "developer" && user.user_type !== "QA")
      throw new Error("You can only assign project to Developer and QA");

    //  find manager own the project

    if (project.manager_id !== manager_id)
      throw new Error("Manager does'nt own that project");

    // Already assign
    const existing = await project.hasUser(user);
    if (existing) throw new Error("User already assigned to project");

    // assign user to a project
    return await project.addUser(user);
  };

  // top developers
  findUsersDevsTop = async (project_id) => {
    const project = await Project.findOne({ where: { id: project_id } });
    const devs = await project.getUsers({
      where: { user_type: "developer" },
      limit: 2,
    });

    if (devs.length === 0)
      throw new Error("No developer assigned to that project");
    return devs;
  };

  //  developer search by name

  findUsersDevs = async (project_id, searchingName) => {
    console.log(searchingName);
    // name: { [Op.iLike]: `%${searchingName}%`
    const project = await Project.findOne({ where: { id: project_id } });
    const devs = await project.getUsers({
      where: {  name: { [Op.iLike]: `%${searchingName}%` } , user_type: "developer" },
      limit: 2,
    });

    if (devs.length === 0)
      throw new Error("No developer assigned to that project");
    return devs;
  };
}

const projectHandlers = new ProjectHandlers();

module.exports = {
  projectHandlers,
};
