const { http_response_status_codes } = require("../http_response_status_codes");
const { ERRORS_MESSAGES, ERRORS_NAMES } = require("../response_msg");
const SHOWN_ERRORS_Of_Project = {
  createProject_error: (error, res) => {
    if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      return res.status(http_response_status_codes.conflict).json({
        error: ERRORS_MESSAGES.project.project_already_exists,
      });
    } else if (
      error instanceof Error &&
      (error.message.startsWith(
        ERRORS_MESSAGES.validation_errors.project_name_required
      ) ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.project_description_required ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.project_image_required)
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    }
  },

  findProjects_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.projects_not_found)
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  findProject_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  updateProject_error: (error, res) => {
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
  },

  deleteProject_error: (error, res) => {
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
  },
  assignProject_error: (error, res) => {
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
  },
  findUsersDevs_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.project_has_no_developer)
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },
  isProjectManager_error: (error, res) => {
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
  },

  unexpected_error: (res) => {
    return res
      .status(http_response_status_codes.internal_server_error)
      .json({ error: ERRORS_MESSAGES.unexpected_error });
  },
};
module.exports = {
  SHOWN_ERRORS_Of_Project,
};
