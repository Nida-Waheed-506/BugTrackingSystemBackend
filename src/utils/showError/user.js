const { http_response_status_codes } = require("../http_response_status_codes");
const { ERRORS_MESSAGES, ERRORS_NAMES } = require("../response_msg");

const SHOWN_ERRORS_Of_User = {
  createUser_error: (error, res) => {
    if (error.name === ERRORS_NAMES.SequelizeValidationError) {
      return res.status(http_response_status_codes.bad_request).json({
        error: ERRORS_MESSAGES.user.invalid_email_format,
      });
    } else if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      return res.status(http_response_status_codes.conflict).json({
        error: ERRORS_MESSAGES.user.user_confict,
      });
    } else if (
      error instanceof Error &&
      (error.message === ERRORS_MESSAGES.validation_errors.name_required ||
        error.message === ERRORS_MESSAGES.validation_errors.email_required ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.user_type_required ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.mobile_number_required ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.password_not_strong ||
        error.message === ERRORS_MESSAGES.validation_errors.password_required ||
        error.message === ERRORS_MESSAGES.validation_errors.user_type_invalid)
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    }
  },

  findUser_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.unauthorized_user)
    ) {
      return res
        .status(http_response_status_codes.unauthorized)
        .json({ error: error.message });
    }
  },
  getUser_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.user_not_found)
    ) {
      return res
        .status(http_response_status_codes.not_found)
        .json({ error: error.message });
    }
  },
  editUser_error: (error, res) => {
    if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.user.password_not_editable) ||
        error.message === ERRORS_MESSAGES.validation_errors.user_type_invalid)
    ) {
      return res
        .status(http_response_status_codes.bad_request)
        .json({ error: error.message });
    } else if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.own_profile_edit)
    ) {
      return res
        .status(http_response_status_codes.unauthorized)
        .json({ error: error.message });
    }
  },
  deleteUser_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.delete_user)
    ) {
      return res
        .status(http_response_status_codes.unauthorized)
        .json({ error: error.message });
    }
  },
  getUsers_error: (error, res) => {
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.users_not_found)
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
  SHOWN_ERRORS_Of_User,
};
