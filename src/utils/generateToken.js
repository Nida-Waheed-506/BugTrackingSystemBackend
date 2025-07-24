const jwt = require("jsonwebtoken");
const generateToken = async (user) => {
  const token = await jwt.sign({ id: user.id }, "NidaWaheedpucit@123", {
    expiresIn: "7d",
  }); //payload (any user data , secret key and expiry date which is optional )
  return token;
};

module.exports = { generateToken };
