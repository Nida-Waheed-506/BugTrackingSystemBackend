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

const typeValidator = (type) => {
  if (type !== "feature" && type !== "bug")
    throw new Error("Type of bug must be feature or bug");
  // if (
  //   type === "feature" &&
  //   status !== "new" &&
  //   status !== "started" &&
  //   status !== "completed"
  // )
  //   throw new Error("Status must be in [new , started , completed]");
  // else if (
  //   type === "bug" &&
  //   status !== "new" &&
  //   status !== "started" &&
  //   status !== "resolved"
  // )
  //   throw new Error("Status must be in [new , started , resolved]");
};

module.exports = { validateUserData, typeValidator };
