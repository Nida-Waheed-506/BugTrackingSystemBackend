const { HTTP_RESPONSE_STATUS_CODES } = require("../httpResponseStatusCode");
const { ERRORS_MESSAGES, ERRORS_NAMES } = require("../response_msg");

const SHOWN_ERRORS_Of_User = {
  createUserError: (error) => {
    let err;
    let statusCode;

    if (error.name === ERRORS_NAMES.SequelizeValidationError) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = ERRORS_MESSAGES.user.invalid_email_format;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.conflict;
      err = ERRORS_MESSAGES.user.user_confict;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
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
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_User.unexpectedError();
      return errorResponse;
    }
  },

  findUserError: (error) => {
    let err;
    let statusCode;

    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.unauthorized_user)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.unauthorized;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_User.unexpectedError();
      return errorResponse;
    }
  },
  getUserError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.user_not_found)
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
      ERRORS_MESSAGES.validation_errors.invalid_user_id_format
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_User.unexpectedError();
      return errorResponse;
    }
  },
  editUserError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      (error.message.startsWith(ERRORS_MESSAGES.user.password_not_editable) ||
        error.message === ERRORS_MESSAGES.validation_errors.user_type_invalid ||
        error.message ===
          ERRORS_MESSAGES.validation_errors.invalid_user_id_format)
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
      error.message.startsWith(ERRORS_MESSAGES.user.own_profile_edit)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.unauthorized;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_User.unexpectedError();
      return errorResponse;
    }
  },
  deleteUserError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.delete_user)
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.unauthorized;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else if (
      error instanceof Error &&
      error.message === ERRORS_MESSAGES.validation_errors.invalid_user_id_format
    ) {
      statusCode = HTTP_RESPONSE_STATUS_CODES.bad_request;
      err = error.message;

      const errorResponse = {
        statusCode: statusCode,
        err: err,
      };
      return errorResponse;
    } else {
      const errorResponse = SHOWN_ERRORS_Of_User.unexpectedError();
      return errorResponse;
    }
  },
  getUsersError: (error) => {
    let err;
    let statusCode;
    if (
      error instanceof Error &&
      error.message.startsWith(ERRORS_MESSAGES.user.users_not_found)
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
        ERRORS_MESSAGES.validation_errors.invalid_users_get_limit_format
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
      const errorResponse = SHOWN_ERRORS_Of_User.unexpectedError();
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
  SHOWN_ERRORS_Of_User,
};
