const { userHandlers } = require("../../handlers/userHandlers");
const {
  validateUserData,
  validatePassword,
  validate_user_type,
  validateUserType,
} = require("../../utils/validation");
const { generateToken } = require("../../utils/generateToken");
const bcrypt = require("bcrypt");
const { ERRORS_MESSAGES } = require("../../utils/response_msg");
// +++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++++

class UserManager {
  createUser = async (userData) => {
    const { password } = userData;

    //validate the user

    validateUserData(userData);
    validateUserType(userData.user_type);
    validatePassword(password);

    // hashed Password

    const hashedPassword = await bcrypt.hash(password, 10); //10 salt round 2^10 times , strong password

    //  add user to DB
    const user = await userHandlers.createUser(userData, hashedPassword);

    //  add the cookies

    const token = await generateToken(user);
    return { user, token };
  };

  findUser = async (userData) => {
    //find user
    const user = await userHandlers.findUser(userData);
    const { password } = userData;
    if (!user) throw new Error(ERRORS_MESSAGES.user.unauthorized_user);
    const passwordHash = await bcrypt.compare(password, user.password);
    if (!passwordHash) throw new Error(ERRORS_MESSAGES.user.unauthorized_user);

    //  add the cookies

    const token = await generateToken(user);
    return { user, token };
  };

  // get user by id

  getUser = async (id) => {
    return await userHandlers.getUser(id);
  };

  editUser = async (id, userData) => {
    const { password, user_type } = userData;
    if (user_type) validate_user_type(userData.user_type);
    if (password) throw new Error(ERRORS_MESSAGES.user.password_not_editable);

    //  add user to DB
    const user = await userHandlers.editUser(id, userData);
    return user;
  };

  deleteUser = async (id) => {
    //  delete user from DB
    return await userHandlers.deleteUser(id);
  };

  // get user by name
  getUsersByName = async (searchingName) => {
    return await userHandlers.getUsersByName(searchingName);
  };
  //get top 5 users
  getUsers = async (limit) => {
    return await userHandlers.getUsers(limit);
  };
}

const userManager = new UserManager();

module.exports = { userManager };
