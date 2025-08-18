const { projectManager } = require("./projectManager");
const {
  ERRORS_MESSAGES,
  ERRORS_NAMES,
  SUCCESS_MESSAGES,
} = require("../../utils/response_msg");
const {
  http_response_status_codes,
} = require("../../utils/http_response_status_codes");
// +++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++

class ProjectController {
  createProject = async (req, res, next) => {
    try {
      const project = await projectManager.createProject(
        req.body,
        req?.file?.buffer,
        req.user
      );

      if (project)
        res.status(http_response_status_codes.created).json({
          message: SUCCESS_MESSAGES.project.project_create,
          data: project,
        });
    } catch (error) {
      if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
        return res.status(http_response_status_codes.conflict).json({
          error: ERRORS_MESSAGES.project.project_already_exists,
        });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  findProjects = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    try {
      // get the project
      const { projects, count } = await projectManager.findProjects(
        limit,
        offset
      );
      if (projects) {
        res.status(http_response_status_codes.ok).json({
          message: SUCCESS_MESSAGES.project.projects_get,
          data: [count, projects, req.user],
        });
      } else
        res
          .status(http_response_status_codes.not_found)
          .json({ error: ERRORS_MESSAGES.project.projects_not_found });
    } catch (error) {
      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  findProject = async (req, res) => {
    try {
      const { project_id } = req.params;
      // get the project
      const project = await projectManager.findProject(project_id);
      if (project)
        res
          .status(http_response_status_codes.ok)
          .json({ error: SUCCESS_MESSAGES.project.project_get, data: project });
    } catch (error) {
   
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  updateProject = async (req, res, next) => {
    try {
      const { project_id: projectId } = req.params;
      const { id: manager_id } = req.user;
      const project = await projectManager.updateProject(
        projectId,
        manager_id,
        req.body
      );

      if (project)
        res.status(http_response_status_codes.ok).json({
          message: SUCCESS_MESSAGES.project.project_update,
          data: project,
        });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager)
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  deleteProject = async (req, res, next) => {
    try {
      const { project_id: projectId } = req.params;

      const { id: manager_id } = req.user;
      const project = await projectManager.deleteProject(projectId, manager_id);
      if (project)
        res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.project.project_delete });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager)
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  assignProject = async (req, res, next) => {
    try {
      const { id: manager_id } = req.user;
      const { project_id } = req.params;
      const { email } = req.body;

      const projectAssigned = await projectManager.assignProject(
        manager_id,
        parseInt(project_id),
        email
      );
      if (projectAssigned)
        res.status(http_response_status_codes.ok).json({
          message: SUCCESS_MESSAGES.project.user_assign_to_project,
          data: projectAssigned,
        });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager)
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.user.user_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(
          ERRORS_MESSAGES.project.project_assign_to_which_users
        )
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.user_already_assigned)
      ) {
        return res
          .status(http_response_status_codes.conflict)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  findUsersDevs = async (req, res, next) => {
    try {
      const { search: searchingName } = req.query;
      const { project_id } = req.params;
      const limit = req.query.limit || 5;

      if (searchingName) {
        const assignedUsers = await projectManager.findUsersDevs(
          parseInt(project_id),
          searchingName
        );

        if (assignedUsers)
          res.status(http_response_status_codes.ok).json({
            message: SUCCESS_MESSAGES.project.project_developer_detail,
            data: Array.isArray(assignedUsers)
              ? assignedUsers
              : [assignedUsers],
          });
      } else {
        const assignedTopUsers = await projectManager.findUsersDevsTop(
          parseInt(project_id),
          limit
        );
        if (assignedTopUsers)
          res.status(http_response_status_codes.ok).json({
            message: SUCCESS_MESSAGES.project.project_developers_detail,
            data: assignedTopUsers,
          });
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(
          ERRORS_MESSAGES.project.project_has_no_developer
        )
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  isProjectManager = async (req, res, next) => {
    try {
      const { project_id } = req.params;

      const { id: manager_id } = req.user;
      const project = await projectManager.isProjectManager(
        parseInt(project_id),
        parseInt(manager_id)
      );
      if (project)
        res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.project.project_manager });
    } catch (error) {
     
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager)
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };
}

const projectController = new ProjectController();

module.exports = {
  projectController,
};
