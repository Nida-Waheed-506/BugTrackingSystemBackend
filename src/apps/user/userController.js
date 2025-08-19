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
const { SHOWN_ERRORS_Of_User } = require("../../utils/showError/user");
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
      SHOWN_ERRORS_Of_User.createUser_error(error, res);
      SHOWN_ERRORS_Of_User.unexpected_error(res);
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
      SHOWN_ERRORS_Of_User.findUser_error(error, res);
      SHOWN_ERRORS_Of_User.unexpected_error(res);
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
      SHOWN_ERRORS_Of_User.getUser_error(error, res);
      SHOWN_ERRORS_Of_User.unexpected_error(res);
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
      SHOWN_ERRORS_Of_User.editUser_error(error, res);
      SHOWN_ERRORS_Of_User.unexpected_error();
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
      SHOWN_ERRORS_Of_User.deleteUser_error(error, res);
      SHOWN_ERRORS_Of_User.unexpected_error();
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
      SHOWN_ERRORS_Of_User.getUser_error(error, res);
      SHOWN_ERRORS_Of_User.unexpected_error(res);
    }
  };
}

const userController = new UserController();

module.exports = { userController };
