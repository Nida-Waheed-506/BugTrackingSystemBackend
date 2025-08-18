const SUCCESS_MESSAGES = {
  user: {
    user_signup: "Sign-up Successfully",
    user_login: "Logged-in successfully",
    users_get: "Users Detail",
  },

  project: {
    project_create: "Project created successfully",
    project_update: "Project updated successfully",
    project_delete: "Project deleted successfully",
    project_assign: "Project assigned successfully",
    projects_get: "Projects Detail",
  },

  bug: {},
};

const ERRORS_NAMES = {
  SequelizeValidationError: "SequelizeValidationError",
  SequelizeUniqueConstraintError: "SequelizeUniqueConstraintError",
};

const ERRORS_MESSAGES = {
  unexpected_error: "Unexpected error",
  user: {
    invalid_email_format: "Invalid email format",
    user_confict: "User already exists",
    unauthorized_user: "Invalid Credentials",
    user_not_found: "User not found",
    users_not_found: "Users not found",
  },

  project: {},

  bug: {},
};

module.exports = { ERRORS_MESSAGES, SUCCESS_MESSAGES, ERRORS_NAMES };
