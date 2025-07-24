const validator = require("validator");

const validateUserData = (userData) => {
  const { name, email, password, user_type, mobile_number } = userData;
  if (!name) throw new Error("Must enter the name");
  else if (!email) throw new Error("Must enter the email");
  else if (!validator.isStrongPassword(password))
    throw new Error("Password is not strong");
  else if (!user_type) throw new Error("Must enter the user_type");
  else if (!mobile_number) throw new Error("Must enter the mobile_number");
};

module.exports = { validateUserData };
