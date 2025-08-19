const { http_response_status_codes } = require("../http_response_status_codes");
const { ERRORS_MESSAGES, ERRORS_NAMES } = require("../response_msg");

const SHOWN_ERRORS_Of_Bug = {
  createBug_error: (error, res) => {
    if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      return res.status(http_response_status_codes.conflict).json({
        error: ERRORS_MESSAGES.bug.task_already_exists,
      });
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
          ERRORS_MESSAGES.validation_errors.bug_members_required)
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.project.project_not_found
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  editBug_error: (error, res) => {
    if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      return res.status(http_response_status_codes.conflict).json({
        error: ERRORS_MESSAGES.bug.task_already_exists,
      });
    } else if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
        error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
        error.message === ERRORS_MESSAGES.validation_errors.bug_status_invalid)
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.project.project_not_found ||
        error.message === ERRORS_MESSAGES.bug.task_not_found)
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  deleteBug_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.project.project_not_found ||
        error.message === ERRORS_MESSAGES.bug.task_not_found)
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  findBugs_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.bug.tasks_not_found
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  findBug_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.bug.task_not_found
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  changeBugStatus_error: (error, res) => {
    if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.bug_status_invalid ||
        error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project)
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.bug.task_not_found
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  isQABelongToProject_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.project.QA_not_assign_to_project
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.project.project_not_found
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },

  isQABelongToBug_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.bug.not_QA_of_task
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.project.project_not_found ||
        error.message === ERRORS_MESSAGES.bug.task_not_found)
    ) {
      return res
        .status(http_response_status_codes.not_found)
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
  SHOWN_ERRORS_Of_Bug,
};
