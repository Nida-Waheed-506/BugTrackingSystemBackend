const { projectHandlers } = require("../../handlers/projectHandlers");
const { userHandlers } = require("../../handlers/userHandlers");
const { Project } = require("../../models/project");
const { User } = require("../../models/user");
const { services } = require("../../services/services");
const { USER_TYPES, EMAIL_TYPE } = require("../../utils/constants");
const {
  HTTP_RESPONSE_STATUS_CODES,
} = require("../../utils/httpResponseStatusCode");
const { ERRORS_MESSAGES } = require("../../utils/response_msg");

// +++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++

class ProjectManager {
  createProject = async (projectData, image, loggedInUserData) => {
    const project = await projectHandlers.createProject(
      projectData,
      image,
      loggedInUserData
    );

    await loggedInUserData.addProject(project);
    return project;
  };

  findProjects = async (limit, offset) => {
    const { count, rows } = await projectHandlers.findProjects(limit, offset);
    const projects = rows.map((project) => {
      const projectJSON = project.toJSON();
      if (projectJSON.image) {
        projectJSON.image = projectJSON.image.toString("base64");
      }
      return projectJSON;
    });

    return { projects, count };
  };

  findProject = async (id) => {
    const project = await projectHandlers.findProject(id);
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    const projectJSON = await project.toJSON();
    if (projectJSON.image) {
      projectJSON.image = projectJSON.image.toString("base64");
    }

    return projectJSON;
  };

  updateProject = async (projectId, manager_id, projectData) => {
    const project = await Project.findOne({
      where: { id: projectId },
    });

    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    const isManager = project.manager_id === manager_id;

    if (!isManager)
      throw new Error(ERRORS_MESSAGES.project.not_project_manager);

    const projectUpdated = await projectHandlers.updateProject(
      project,
      projectData
    );

    return projectUpdated;
  };

  deleteProject = async (projectId, manager_id) => {
    const project = await Project.findOne({
      where: { id: projectId },
    });
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    const isManager = project.manager_id === manager_id;

    if (!isManager)
      throw new Error(ERRORS_MESSAGES.project.not_project_manager);

    const projectDeleted = await projectHandlers.deleteProject(project);

    return projectDeleted;
  };

  isProjectManager = async (project_id, manager_id) => {
    const project = await Project.findOne({
      where: { id: project_id },
    });

    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    const isManager = await projectHandlers.isProjectManager(
      project,
      manager_id
    );

    if (!isManager)
      throw new Error(ERRORS_MESSAGES.project.not_project_manager);
    return isManager;
  };

  assignProject = async (manager_id, project_id, email) => {
    // find project exists or not

    const project = await Project.findOne({ where: { id: project_id } });
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    // find user exists or not
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new Error(ERRORS_MESSAGES.user.user_not_found);

    //  find user is QA or developer

    if (
      user.user_type !== USER_TYPES.developer &&
      user.user_type !== USER_TYPES.QA
    )
      throw new Error(ERRORS_MESSAGES.project.project_assign_to_which_users);

    //  find manager own the project

    if (project.manager_id !== manager_id)
      throw new Error(ERRORS_MESSAGES.project.not_project_manager);

    // Already assign
    const existing = await project.hasUser(user);
    if (existing)
      throw new Error(ERRORS_MESSAGES.project.user_already_assigned);

    const projectAssign = await projectHandlers.projectAssign(project, user);

    if (projectAssign) {
      const user = await userHandlers.getUser(
        projectAssign[0].dataValues.UserId
      );
      const project = await projectHandlers.getProject(
        projectAssign[0].dataValues.ProjectId
      );
      services.sendEmail(user, project, EMAIL_TYPE.project);
    }

    return projectAssign;
  };

  findUsersDevs = async (project_id, searchingName) => {
    const project = await Project.findOne({ where: { id: project_id } });
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);
    const devs = await projectHandlers.findUsersDevs(project, searchingName);
    if (devs.length === 0)
      throw new Error(ERRORS_MESSAGES.project.project_has_no_developer);
    return devs;
  };

  findUsersDevsTop = async (project_id, limit) => {
    const project = await Project.findOne({ where: { id: project_id } });
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);
    const devs = await projectHandlers.findUsersDevsTop(project, limit);
    if (devs.length === 0)
      throw new Error(ERRORS_MESSAGES.project.project_has_no_developer);
    return devs;
  };
}

const projectManager = new ProjectManager();

module.exports = { projectManager };
