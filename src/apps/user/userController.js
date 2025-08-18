const { userManager } = require("./userManager");
const { static_keywords } = require("../../utils/constants");
const {
  ERRORS_MESSAGES,
  ERRORS_NAMES,
  SUCCESS_MESSAGES,
} = require("../../utils/response_msg");

const {
  http_response_status_codes,
} = require("../../utils/http_response_status_codes");
// +++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++

class UserController {
  createUser = async (req, res) => {
    try {
      const { user, token } = await userManager.createUser(req.body);

      res.cookie(static_keywords.cookie_name, token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res
        .status(http_response_status_codes.created)
        .json({ message: SUCCESS_MESSAGES.user.user_signup, data: user });
    } catch (error) {
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
        (ERRORS_MESSAGES.validation_errors.name_required ||
          ERRORS_MESSAGES.validation_errors.email_required ||
          ERRORS_MESSAGES.validation_errors.user_type_required ||
          ERRORS_MESSAGES.validation_errors.mobile_number_required ||
          ERRORS_MESSAGES.validation_errors.password_not_strong ||
          ERRORS_MESSAGES.validation_errors.password_required)
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

  findUser = async (req, res) => {
    try {
      const { user, token } = await userManager.findUser(req.body);
      if (user) {
        res.cookie(static_keywords.cookie_name, token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.user.user_login, data: user });
      } else throw new Error(ERRORS_MESSAGES.user.unauthorized_user);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.user.unauthorized_user)
      ) {
        return res
          .status(http_response_status_codes.unauthorized)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  getUser = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userManager.getUser(parseInt(id));
      if (!user) throw new Error(ERRORS_MESSAGES.user.user_not_found);

      return res
        .status(http_response_status_codes.ok)
        .json({ message: SUCCESS_MESSAGES.user.user_get, data: user });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.user.user_not_found)
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

  editUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { id: loggedInUserId } = req.user;

      if (parseInt(id) !== loggedInUserId)
        throw new Error(ERRORS_MESSAGES.user.own_profile_edit);
      const user = await userManager.editUser(parseInt(id), req.body);
      if (user)
        return res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.user.user_update });
    } catch (error) {
    
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.user.password_not_editable)
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

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { id: loggedInUserId } = req.user;

      if (parseInt(id) !== loggedInUserId)
        throw new Error(ERRORS_MESSAGES.user.delete_user);
      const user = await userManager.deleteUser(parseInt(id));
      if (user)
        return res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.user.user_delete });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.user.delete_user)
      ) {
        return res
          .status(http_response_status_codes.unauthorized)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  getUsers = async (req, res) => {
    try {
      const { search: searchingName } = req.query;
      const limit = req.query.limit || 5;
      if (searchingName) {
        const users = await userManager.getUsersByName(searchingName);
        if (!users) throw new Error(ERRORS_MESSAGES.user.users_not_found);

        res.status(http_response_status_codes.ok).json({
          message: SUCCESS_MESSAGES.user.users_get,
          data: Array.isArray(users) ? users : [users],
        });
      } else {
        const topUsers = await userManager.getUsers(limit);
        return res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.user.users_get, data: topUsers });
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(ERRORS_MESSAGES.user.users_not_found)
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
}

const userController = new UserController();

module.exports = { userController };
