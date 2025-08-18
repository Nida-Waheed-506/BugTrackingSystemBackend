const jwt = require("jsonwebtoken");
const generateToken = async (user) => {
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
  }); //payload (any user data , secret key and expiry date which is optional )
  return token;
};

module.exports = { generateToken };
