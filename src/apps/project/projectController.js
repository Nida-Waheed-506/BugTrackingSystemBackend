const { projectManager } = require("./projectManager");
const {
  ERRORS_MESSAGES,
  ERRORS_NAMES,
  SUCCESS_MESSAGES,
} = require("../../utils/response_msg");
const {
  HTTP_RESPONSE_STATUS_CODES,
} = require("../../utils/httpResponseStatusCode");
const { SHOWN_ERRORS_Of_Project } = require("../../utils/getError/project");
const {
  validateProjectData,
  paginationPageValidator,
  paginationLimitValidator,
  projectIdValidator,
  userGetLimitValidator,
} = require("../../utils/validation");
// +++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++

class ProjectController {
  createProject = async (req, res, next) => {
    try {
      validateProjectData(req.body, req?.file?.buffer);
      const project = await projectManager.createProject(
        req.body,
        req?.file?.buffer,
        req.user
      );

      if (project)
        res.status(HTTP_RESPONSE_STATUS_CODES.created).json({
          message: SUCCESS_MESSAGES.project.project_create,
          data: project,
        });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.createProjectError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  findProjects = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    try {
      paginationPageValidator(page);
      paginationLimitValidator(limit);
      // get the project
      const { projects, count } = await projectManager.findProjects(
        limit,
        offset
      );
      if (projects) {
        res.status(HTTP_RESPONSE_STATUS_CODES.ok).json({
          message: SUCCESS_MESSAGES.project.projects_get,
          data: [count, projects, req.user],
        });
      } else throw new Error(ERRORS_MESSAGES.project.projects_not_found);
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.findProjectsError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  findProject = async (req, res) => {
    try {
      let { project_id } = req.params;
      project_id = projectIdValidator(project_id);

      const project = await projectManager.findProject(project_id);
      if (project)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ error: SUCCESS_MESSAGES.project.project_get, data: project });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.findProjectError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  updateProject = async (req, res, next) => {
    try {
      let { project_id: projectId } = req.params;
      const { id: manager_id } = req.user;

      projectId = projectIdValidator(projectId);

      const project = await projectManager.updateProject(
        projectId,
        manager_id,
        req.body
      );

      if (project)
        res.status(HTTP_RESPONSE_STATUS_CODES.ok).json({
          message: SUCCESS_MESSAGES.project.project_update,
          data: project,
        });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.updateProjectError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  deleteProject = async (req, res, next) => {
    try {
      let { project_id: projectId } = req.params;
      const { id: manager_id } = req.user;

      projectId = projectIdValidator(projectId);
      const project = await projectManager.deleteProject(projectId, manager_id);
      if (project)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.project.project_delete });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.deleteProjectError(
        error,
        res
      );

      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  assignProject = async (req, res, next) => {
    try {
      const { id: manager_id } = req.user;
      let { project_id } = req.params;
      const { email } = req.body;

      project_id = projectIdValidator(project_id);
      const projectAssigned = await projectManager.assignProject(
        manager_id,
        project_id,
        email
      );
      if (projectAssigned)
        res.status(HTTP_RESPONSE_STATUS_CODES.ok).json({
          message: SUCCESS_MESSAGES.project.user_assign_to_project,
          data: projectAssigned,
        });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.assignProjectError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  findUsersDevs = async (req, res, next) => {
    try {
      const { search: searchingName } = req.query;
      let { project_id } = req.params;
      const limit = req.query.limit || 5;

      project_id = projectIdValidator(project_id);

      userGetLimitValidator(limit);

      if (searchingName) {
        const assignedUsers = await projectManager.findUsersDevs(
          project_id,
          searchingName
        );

        if (assignedUsers)
          res.status(HTTP_RESPONSE_STATUS_CODES.ok).json({
            message: SUCCESS_MESSAGES.project.project_developer_detail,
            data: Array.isArray(assignedUsers)
              ? assignedUsers
              : [assignedUsers],
          });
      } else {
        const assignedTopUsers = await projectManager.findUsersDevsTop(
          project_id,
          limit
        );
        if (assignedTopUsers)
          res.status(HTTP_RESPONSE_STATUS_CODES.ok).json({
            message: SUCCESS_MESSAGES.project.project_developers_detail,
            data: assignedTopUsers,
          });
      }
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.findUsersDevsError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  isProjectManager = async (req, res, next) => {
    try {
      let { project_id } = req.params;

      const { id: manager_id } = req.user;
      project_id = projectIdValidator(project_id);
      const project = await projectManager.isProjectManager(
        project_id,
        manager_id
      );
      if (project)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.project.project_manager });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Project.isProjectManagerError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };
}

const projectController = new ProjectController();

module.exports = {
  projectController,
};
