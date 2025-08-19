const validator = require("validator");
const { ERRORS_MESSAGES } = require("./response_msg");
const { bugs_types, user_types } = require("./constants");

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

const validate_user_type = (user_type) => {
  if (
    !(
      user_type === user_types.manager ||
      user_type === user_types.developer ||
      user_type === user_types.QA
    )
  )
    throw new Error(ERRORS_MESSAGES.validation_errors.user_type_invalid);
};

const validatePassword = (password) => {
  if (!password)
    throw new Error(ERRORS_MESSAGES.validation_errors.password_required);
  if (!validator.isStrongPassword(password))
    throw new Error(ERRORS_MESSAGES.validation_errors.password_not_strong);
};

const validateProjectData = (projectData, image) => {
  if (!projectData.projectName)
    throw new Error(ERRORS_MESSAGES.validation_errors.project_name_required);
  else if (!projectData.projectDes)
    throw new Error(
      ERRORS_MESSAGES.validation_errors.project_description_required
    );
  else if (!image)
    throw new Error(ERRORS_MESSAGES.validation_errors.project_image_required);
};

const typeValidator = (type) => {
  if (
    !(
      type === bugs_types.bug.type_name || type === bugs_types.feature.type_name
    )
  )
    throw new Error(ERRORS_MESSAGES.validation_errors.bugs_types_invalid);
};

const validateBugData = (bugDetail) => {
  if (!bugDetail.title)
    throw new Error(ERRORS_MESSAGES.validation_errors.bug_title_required);
  else if (!bugDetail.description)
    throw new Error(ERRORS_MESSAGES.validation_errors.bug_des_required);
  if (!bugDetail.type)
    throw new Error(ERRORS_MESSAGES.validation_errors.bug_type_required);
  if (!bugDetail.deadline)
    throw new Error(ERRORS_MESSAGES.validation_errors.bug_deadline_required);
  if (bugDetail.developer_id.length === 0)
    throw new Error(ERRORS_MESSAGES.validation_errors.bug_members_required);
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
  validateBugData,
  validate_user_type,
  validateProjectData,
  typeValidator,
  validatePassword,
  statusValidator,
};
