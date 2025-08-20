const { HTTP_RESPONSE_STATUS_CODES } = require("../httpResponseStatusCode");
const { ERRORS_MESSAGES, ERRORS_NAMES } = require("../response_msg");
const SHOWN_ERRORS_Of_Project = {
  createProjectError: (error) => {
    let err;
    let statusCode;
    if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.conflict;
      err = ERRORS_MESSAGES.project.project_already_exists;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
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
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();
      return errorResponse;
    }
  },

  findProjectsError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.projects_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message.startsWith(
        ERRORS_MESSAGES.validation_errors.invalid_pagination_page_format
      ) ||
        error.message.startsWith(
          ERRORS_MESSAGES.validation_errors.invalid_pagination_limit_format
        ))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();

      return errorResponse;
    }
  },

  findProjectError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      error.message.startsWith(
        ERRORS_MESSAGES.validation_errors.invalid_project_id_format
      )
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();
      return errorResponse;
    }
  },

  updateProjectError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager) ||
        error.message.startsWith(
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format
        ))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();
      return errorResponse;
    }
  },

  deleteProjectError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager) ||
        error.message.startsWith(
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format
        ))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();
      return errorResponse;
    }
  },
  assignProjectError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.project.project_not_found) ||
        error.message.startsWith(ERRORS_MESSAGES.user.user_not_found))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager) ||
        error.message.startsWith(
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format
        ) ||
        error.message.startsWith(
          ERRORS_MESSAGES.project.project_assign_to_which_users
        ))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.user_already_assigned)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.conflict;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();
      return errorResponse;
    }
  },
  findUsersDevsError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.project.project_not_found) ||
        error.message.startsWith(
          ERRORS_MESSAGES.project.project_has_no_developer
        ))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message.startsWith(
        ERRORS_MESSAGES.validation_errors.invalid_project_id_format
      ) ||
        error.message.startsWith(
          ERRORS_MESSAGES.validation_errors.invalid_users_get_limit_format
        ))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();
      return errorResponse;
    }
  },
  isProjectManagerError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.project.project_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.project.not_project_manager) ||
        error.message.startsWith(
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format
        ))
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Project.unexpectedError();
      return errorResponse;
    }
  },

  unexpectedError: () => {
    statusCode = HTTP_RESPONSE_STATUS_CODES.internal_server_error;
    err = ERRORS_MESSAGES.unexpected_error;

    const errorResponse = {
      statusCode: statusCode,
      err: err,
    };

    return errorResponse;
  },
};
module.exports = {
  SHOWN_ERRORS_Of_Project,
};
