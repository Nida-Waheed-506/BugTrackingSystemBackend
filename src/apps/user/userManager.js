const { userHandlers } = require("../../handlers/userHandlers");
const { validateUserData } = require("../../utils/userValidation");
const { generateToken } = require("../../utils/generateToken");

// +++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++++

class UserManager {
  createUser = async (userData) => {
    //validate the user

    validateUserData(userData);

    //  add user to DB
    const user = await userHandlers.createUser(userData);

    //  add the cookies

    const token = await generateToken(user);
    return { user, token };
  };

  findUser = async (userData) => {
    //find user
    const user = await userHandlers.findUser(userData);

    //  add the cookies

    const token = await generateToken(user);
    return { user, token };
  };

  // get user by name
  getUsersByName = async (searchingName) => {
    return await userHandlers.getUsersByName(searchingName);
  };
  //get top 5 users
  getUsers = async () => {
    return await userHandlers.getUsers();
  };
  // get user by id

  getUser = async (id) => {
    return await userHandlers.getUser(id);
  };
}

const userManager = new UserManager();

module.exports = { userManager };
