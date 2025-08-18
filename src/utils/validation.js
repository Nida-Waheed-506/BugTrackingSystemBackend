const validator = require("validator");
const { ERRORS_MESSAGES } = require("./response_msg");
const { bugs_types } = require("./constants");

const validateUserData = (userData) => {
  const { name, email, user_type, mobile_number } = userData;
  if (!name) throw new Error(ERRORS_MESSAGES.validation_errors.name_required);
  else if (!email)
    throw new Error(ERRORS_MESSAGES.validation_errors.email_required);
  else if (!user_type)
    throw new Error(ERRORS_MESSAGES.validation_errors.user_type_required);
  else if (!mobile_number)
    throw new Error(ERRORS_MESSAGES.validation_errors.mobile_number_required);
};

const validatePassword = (password) => {
  if (!password)
    throw new Error(ERRORS_MESSAGES.validation_errors.password_required);
  if (!validator.isStrongPassword(password))
    throw new Error(ERRORS_MESSAGES.validation_errors.password_not_strong);
};

const typeValidator = (type) => {
  if (type !== bugs_types.bug.type_name && bugs_types.feature.type_name)
    throw new Error(ERRORS_MESSAGES.validation_errors.bugs_types_invalid);
};

const statusValidator = (type, status) => {
  if (
    type === bugs_types.feature.type_name &&
    status !== bugs_types.feature.status.new &&
    status !== bugs_types.feature.status.started &&
    status !== bugs_types.feature.status.completed
  )
    throw new Error(ERRORS_MESSAGES.validation_errors.feature_status_invalid);
  else if (
    type === bugs_types.bug.type_name &&
    status !== bugs_types.bug.status.new &&
    status !== bugs_types.bug.status.started &&
    status !== bugs_types.bug.status.resolved
  )
    throw new Error(ERRORS_MESSAGES.validation_errors.bug_status_invalid);
};

module.exports = {
  validateUserData,
  typeValidator,
  validatePassword,
  statusValidator,
};
