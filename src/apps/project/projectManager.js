const { projectHandlers } = require("../../handlers/projectHandlers");
const { userHandlers } = require("../../handlers/userHandlers");
const { services } = require("../../services/services");

// +++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++

class ProjectManager {
  createProject = async (projectData, image, loggedInUserData) => {
    const project = projectHandlers.createProject(
      projectData,
      image,
      loggedInUserData
    );

    await loggedInUserData.addProject(project);
    return project;
  };

  findProjects = async (limit, offset) => {
    return await projectHandlers.findProjects(limit, offset);
  };

  isProjectManager = async (project_id, manager_id) => {
    return projectHandlers.isProjectManager(
      parseInt(project_id),
      parseInt(manager_id)
    );
  };
  updateProject = async (projectId, manager_id, projectData) => {
    return await projectHandlers.updateProject(
      projectId,
      manager_id,
      projectData
    );
  };

  deleteProject = async (projectId, manager_id) => {
    return await projectHandlers.deleteProject(projectId, manager_id);
  };

  assignProject = async (manager_id, project_id, email) => {
    const projectAssign = await projectHandlers.projectAssign(
      manager_id,
      parseInt(project_id),
      email
    );

    if (projectAssign) {
      const user = await userHandlers.getUser(
        projectAssign[0].dataValues.UserId
      );
      const project = await projectHandlers.getProject(
        projectAssign[0].dataValues.ProjectId
      );
      services.sendEmail(user, project, "project");
    }

    return projectAssign;
  };

  findUsersDevs = async (project_id, searchingName) => {
    return await projectHandlers.findUsersDevs(project_id, searchingName);
  };

  findUsersDevsTop = async (project_id) => {
    return await projectHandlers.findUsersDevsTop(project_id);
  };
}

const projectManager = new ProjectManager();

module.exports = { projectManager };
