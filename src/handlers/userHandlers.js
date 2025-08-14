const { User } = require("../models/user");
const { Op } = require("sequelize");
const { static_keywords } = require("../utils/constants");

// ++++++++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++

class UserHandlers {
  createUser = async (userData, hashedPassword) => {
    const { name, email, user_type, mobile_number } = userData;

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      user_type: user_type,
      mobile_number: mobile_number,
    });
    return user;
  };

  findUser = async (userData) => {
    const { email } = userData;

    const user = await User.findOne({
      where: { email: email },
    });

    return user;
  };

  getUser = async (id) => {
    return await User.findOne({
      where: { id: id },
    });
  };

  getUsersByName = async (searchingName) => {
    //  case insensitive and also the partial searching
    return await User.findOne({
      where: {
        name: { [Op.iLike]: `%${searchingName}%` },
        user_type: { [Op.or]: [static_keywords.developer, constants.QA] },
      },
    });
  };
  getUsers = async () => {
    return await User.findAll({
      where: {
        user_type: { [Op.or]: [static_keywords.developer, constants.QA] },
      },
      limit: 5,
    });
  };
}

const userHandlers = new UserHandlers();

module.exports = { userHandlers };
