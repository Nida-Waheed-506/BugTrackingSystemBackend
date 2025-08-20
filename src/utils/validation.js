const validator = require("validator");
const { ERRORS_MESSAGES } = require("./response_msg");
const { BUGS_TYPES, USER_TYPES } = require("./constants");

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

const validateUserType = (user_type) => {
  if (
    !(
      user_type === USER_TYPES.manager ||
      user_type === USER_TYPES.developer ||
      user_type === USER_TYPES.QA
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
    !(type === BUGS_TYPES.bug.typeName || type === BUGS_TYPES.feature.typeName)
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
    type === BUGS_TYPES.feature.typeName &&
    status !== BUGS_TYPES.feature.status.new &&
    status !== BUGS_TYPES.feature.status.started &&
    status !== BUGS_TYPES.feature.status.completed
  )
    throw new Error(ERRORS_MESSAGES.validation_errors.feature_status_invalid);
  else if (
    type === BUGS_TYPES.bug.typeName &&
    status !== BUGS_TYPES.bug.status.new &&
    status !== BUGS_TYPES.bug.status.started &&
    status !== BUGS_TYPES.bug.status.resolved
  )
    throw new Error(ERRORS_MESSAGES.validation_errors.bug_status_invalid);
};

const userIdValidator = (id) => {
  if (isNaN(id))
    throw new Error(ERRORS_MESSAGES.validation_errors.invalid_user_id_format);
  return (id = parseInt(id));
};

const projectIdValidator = (project_id) => {
  if (isNaN(project_id))
    throw new Error(
      ERRORS_MESSAGES.validation_errors.invalid_project_id_format
    );
  return (project_id = parseInt(project_id));
};

const bugIdValidator = (bug_id) => {
  if (isNaN(bug_id))
    throw new Error(ERRORS_MESSAGES.validation_errors.invalid_bug_id_format);
  return (bug_id = parseInt(bug_id));
};

const paginationPageValidator = (page) => {
  if (isNaN(page))
    throw new Error(
      ERRORS_MESSAGES.validation_errors.invalid_pagination_page_format
    );
};

const paginationLimitValidator = (limit) => {
  if (isNaN(limit))
    throw new Error(
      ERRORS_MESSAGES.validation_errors.invalid_pagination_limit_format
    );
};

const userGetLimitValidator = (limit) => {
  if (isNaN(limit))
    throw new Error(
      ERRORS_MESSAGES.validation_errors.invalid_users_get_limit_format
    );
};

module.exports = {
  validateUserData,
  validateBugData,
  validateUserType,
  validateProjectData,
  typeValidator,
  validatePassword,
  statusValidator,
  userIdValidator,
  projectIdValidator,
  paginationPageValidator,
  paginationLimitValidator,
  userGetLimitValidator,
  bugIdValidator,
};
