const { User } = require("../models/user");
const { Op } = require("sequelize");
const { user_types } = require("../utils/constants");

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

  editUser = async (id, userData) => {
    const user = await User.update(userData, {
      where: { id: id },
    });
    return user;
  };

  deleteUser = async (id) => {
    const user = await User.destroy({ where: { id: id } });
    return user;
  };

  getUsersByName = async (searchingName) => {
    //  case insensitive and also the partial searching
    return await User.findOne({
      where: {
        name: { [Op.iLike]: `%${searchingName}%` },
        user_type: { [Op.or]: [user_types.developer, user_types.QA] },
      },
    });
  };
  getUsers = async (limit) => {
    return await User.findAll({
      where: {
        user_type: { [Op.or]: [user_types.developer, user_types.QA] },
      },
      limit: limit,
    });
  };
}

const userHandlers = new UserHandlers();

module.exports = { userHandlers };
