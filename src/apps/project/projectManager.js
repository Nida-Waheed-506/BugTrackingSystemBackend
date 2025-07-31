const { projectHandlers } = require("../../handlers/projectHandlers");
const { userHandlers } = require("../../handlers/userHandlers");
const {services} = require("../../services/services");

// +++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++

class ProjectManager {
  createProject = async (projectData, image, loggedInUserData) => {
    return await projectHandlers.createProject(
      projectData,
      image,
      loggedInUserData
    );
  };

  findProjects = async () => {
    return await projectHandlers.findProjects();
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
      const user = await userHandlers.getUser(projectAssign[0].dataValues.UserId);
      const project = await projectHandlers.getProject(projectAssign[0].dataValues.ProjectId);
      services.sendEmail(user, project, "project");
    }

    return projectAssign;
  };



  findUsersDevs = async (project_id) => {
    return await projectHandlers.findUsersDevs(project_id);
  }

}

const projectManager = new ProjectManager();

module.exports = { projectManager };
