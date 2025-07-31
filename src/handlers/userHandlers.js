const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// ++++++++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++

class UserHandlers {
  createUser = async (userData) => {
    const { name, email, password, user_type, mobile_number } = userData;

    const hashedPassword = await bcrypt.hash(password, 10); //10 salt round 2^10 times , strong password

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
    const { email, password } = userData;

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) throw new Error("Invalid Credentials");
    const passwordHash = await bcrypt.compare(password, user.password);
    if (!passwordHash) throw new Error("Invalid Credentials");
    return user;
  };

  getUser = async (id) => {
    return await User.findOne({
      where: { id:id },
    });
  };

  getUsersByName = async (searchingName) => {
  //  case insensitive and also the partial searching 
    return await User.findOne({ where: {name: { [Op.iLike]: `%${searchingName}%` } , user_type: {[Op.or]: ["developer" , "QA"]} }});
  };
   getUsers = async () => {
    
    return await User.findAll({where: {user_type: {[Op.or]:['developer' , 'QA']}} ,  limit:5  });
 
  
  };
}

const userHandlers = new UserHandlers();

module.exports = { userHandlers };
