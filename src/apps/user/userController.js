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

  getUsers = async (req, res) => {
    try {
      const { search: searchingName } = req.query;

      if (searchingName) {
        const users = await userManager.getUsersByName(searchingName);
        if (!users) throw new Error(ERRORS_MESSAGES.user.users_not_found);

        res.status(http_response_status_codes.ok).json({
          message: SUCCESS_MESSAGES.user.users_get,
          data: Array.isArray(users) ? users : [users],
        });
      } else {
        const topUsers = await userManager.getUsers();
        return res.json({ data: topUsers });
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

  getUser = async (req, res) => {
    try {
      const { id } = req.query;

      const user = await userManager.getUser(parseInt(id));
      if (!user) throw new Error(ERRORS_MESSAGES.user.user_not_found);

      return res.status(http_response_status_codes.ok).json({ data: user });
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
}

const userController = new UserController();

module.exports = { userController };
