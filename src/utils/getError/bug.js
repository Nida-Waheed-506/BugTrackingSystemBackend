const { HTTP_RESPONSE_STATUS_CODES } = require("../httpResponseStatusCode");
const { ERRORS_MESSAGES, ERRORS_NAMES } = require("../response_msg");

const SHOWN_ERRORS_Of_Bug = {
  createBugError: (error, res) => {
    let err;
    let statusCode;
    if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.conflict;
      err = ERRORS_MESSAGES.bug.task_already_exists;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
        error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.bug_status_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.bug_title_required ||
        error.message === ERRORS_MESSAGES.validation_errors.bug_des_required ||
        error.message === ERRORS_MESSAGES.validation_errors.bug_type_required ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.bug_deadline_required ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.bug_members_required ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format)
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
      error.message === ERRORS_MESSAGES.project.project_not_found
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
      return errorResponse;
    }
  },

  editBugError: (error, res) => {
    let err;
    let statusCode;
    if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.conflict;
      err = ERRORS_MESSAGES.bug.task_already_exists;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
        error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.bug_status_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_bug_id_format)
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
      (error.message === ERRORS_MESSAGES.project.project_not_found ||
        error.message === ERRORS_MESSAGES.bug.task_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
      return errorResponse;
    }
  },

  deleteBugError: (error, res) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_bug_id_format)
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
      (error.message === ERRORS_MESSAGES.project.project_not_found ||
        error.message === ERRORS_MESSAGES.bug.task_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
      return errorResponse;
    }
  },

  findBugsError: (error, res) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.bug.tasks_not_found
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
      (error.message ===
        ERRORS_MESSAGES.validation_errors.invalid_project_id_format ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_pagination_limit_format ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_pagination_page_format)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
      return errorResponse;
    }
  },

  findBugError: (error, res) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.bug.task_not_found
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
      error.message === ERRORS_MESSAGES.validation_errors.invalid_bug_id_format
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
      return errorResponse;
    }
  },

  changeBugStatusError: (error, res) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.bug_status_invalid ||
        error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_project_id_format ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_bug_id_format)
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
      error.message === ERRORS_MESSAGES.bug.task_not_found
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
      return errorResponse;
    }
  },

  isQABelongToProjectError: (error, res) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project ||
        ERRORS_MESSAGES.validation_errors.invalid_project_id_format)
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
      error.message === ERRORS_MESSAGES.project.project_not_found
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
      return errorResponse;
    }
  },

  isQABelongToBugError: (error, res) => {
    if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.bug.not_QA_of_task ||
        ERRORS_MESSAGES.validation_errors.invalid_bug_id_format ||
        ERRORS_MESSAGES.validation_errors.invalid_project_id_format)
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
      (error.message === ERRORS_MESSAGES.project.project_not_found ||
        error.message === ERRORS_MESSAGES.bug.task_not_found)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.not_found;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_Bug.unexpectedError();
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
  SHOWN_ERRORS_Of_Bug,
};
