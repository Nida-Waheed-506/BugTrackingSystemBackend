const { userManager } = require("./userManager");
const { STATIC_KEYWORDS } = require("../../utils/constants");
const {
  ERRORS_MESSAGES,
  ERRORS_NAMES,
  SUCCESS_MESSAGES,
} = require("../../utils/response_msg");

const {
  HTTP_RESPONSE_STATUS_CODES,
} = require("../../utils/httpResponseStatusCode");
const { SHOWN_ERRORS_Of_User } = require("../../utils/response_msg");
const {
  userGetLimitValidator,
  userIdValidator,
} = require("../../utils/response_msg");
// +++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++

class UserController {
  createUser = async (req, res) => {
    try {
      const { user, token } = await userManager.createUser(req.body);

      res.cookie(STATIC_KEYWORDS.cookieName, token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res
        .status(HTTP_RESPONSE_STATUS_CODES.created)
        .json({ message: SUCCESS_MESSAGES.user.user_signup, data: user });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_User.createUserError(error, res);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  findUser = async (req, res) => {
    try {
      const { user, token } = await userManager.findUser(req.body);
      if (user) {
        res.cookie(STATIC_KEYWORDS.cookieName, token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.user.user_login, data: user });
      } else throw new Error(ERRORS_MESSAGES.user.unauthorized_user);
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_User.findUserError(error, res);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  getUser = async (req, res) => {
    try {
      let { id } = req.params;

      id = userIdValidator(id);

      const user = await userManager.getUser(id);
      if (!user) throw new Error(ERRORS_MESSAGES.user.user_not_found);

      return res
        .status(HTTP_RESPONSE_STATUS_CODES.ok)
        .json({ message: SUCCESS_MESSAGES.user.user_get, data: user });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_User.getUserError(error, res);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  editUser = async (req, res) => {
    try {
      let { id } = req.params;
      const { id: loggedInUserId } = req.user;

      id = userIdValidator(id);

      if (id !== loggedInUserId)
        throw new Error(ERRORS_MESSAGES.user.own_profile_edit);
      const user = await userManager.editUser(id, req.body);
      if (user)
        return res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.user.user_update });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_User.editUserError(error, res);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  deleteUser = async (req, res) => {
    try {
      let { id } = req.params;
      const { id: loggedInUserId } = req.user;
      id = userIdValidator(id);
      if (id !== loggedInUserId)
        throw new Error(ERRORS_MESSAGES.user.delete_user);
      const user = await userManager.deleteUser(id);
      if (user)
        return res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.user.user_delete });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_User.deleteUserError(error, res);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  getUsers = async (req, res) => {
    try {
      const { search: searchingName } = req.query;
      const limit = req.query.limit || 5;
      userGetLimitValidator(limit);
      if (searchingName) {
        const users = await userManager.getUsersByName(searchingName);
        if (!users) throw new Error(ERRORS_MESSAGES.user.users_not_found);

        res.status(HTTP_RESPONSE_STATUS_CODES.ok).json({
          message: SUCCESS_MESSAGES.user.users_get,
          data: Array.isArray(users) ? users : [users],
        });
      } else {
        const topUsers = await userManager.getUsers(limit);
        return res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.user.users_get, data: topUsers });
      }
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_User.getUserError(error, res);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };
}

const userController = new UserController();

module.exports = { userController };
