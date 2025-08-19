const ERRORS_NAMES = {
  SequelizeValidationError: "SequelizeValidationError",
  SequelizeUniqueConstraintError: "SequelizeUniqueConstraintError",
};

const SUCCESS_MESSAGES = {
  user: {
    user_signup: "Sign-up Successfully",
    user_login: "Logged-in successfully",
    user_logout: "Logout successfully",
    user_update: "Profile updated successfully",
    user_delete: "User deleted successfully",
    users_get: "Users Detail",
    user_get: "User Detail",
  },

  project: {
    project_create: "Project created successfully",
    project_update: "Project updated successfully",
    project_delete: "Project deleted successfully",
    project_assign: "Project assigned successfully",
    projects_get: "Projects Detail",
    project_get: "Project Detail",
    project_manager: "You are manager of that project",
    user_assign_to_project: "User assigned to  project  successfully",
    project_developer_detail: "Project developer detail",
    project_developers_detail: "Project developers detail",
    project_valid_QA: "You are the QA of that project",
  },

  bug: {
    task_create: "Task created successfully",
    task_update: "Task is updated successfully",
    task_delete: "Task deleted successfully",
    task_get: "Task Detail",
    tasks_get: "Tasks Detail",
    task_status_change: "Task's status changes successfully",
    task_valid_QA: "You QA edit the task",
  },
};

const ERRORS_MESSAGES = {
  unexpected_error: "Unexpected error",
  validation_errors: {
    name_required: "Name is required",
    email_required: "Email is required",
    password_required: "Password is required",
    user_type_required: "User_type is required",
    user_type_invalid: "User_type must be in  [manager , developer , QA]",
    mobile_number_required: "Mobile_number is required",
    password_not_strong: "Password is not strong",
    project_name_required: "Project name is required",
    project_description_required: "project description is required",
    project_image_required: "Project_image is required",
    bug_title_required: "Task title is required",
    bug_des_required: "Task description is required",
    bug_type_required: "Task type is required",
    bug_deadline_required: "Task deadline is required",
    bug_members_required: "Bug (assigned to which Developer) is required",
    bugs_types_invalid: "Type of bug must be feature or bug",
    bug_status_invalid: "Status must be in [new , started , completed]",
    feature_status_invalid: "Status must be in [new , started , resolved]",
  },
  user: {
    invalid_email_format: "Invalid email format",
    user_confict: "User already exists",
    unauthorized_user: "Invalid Credentials",
    user_not_found: "User not found",
    users_not_found: "Users not found",
    own_profile_edit: "Users can only edit their own information",
    delete_user: "Users are only allowed to delete their own profiles",
    password_not_editable: "You can't edit the password",
  },

  project: {
    projects_not_found: "Projects not found",
    project_not_found: "Project not found",
    not_project_manager: "Manager does'nt own that project",
    project_assign_to_which_users:
      "You can only assign project to Developer and QA",
    user_already_assigned: "User already assigned to project",
    project_has_no_developer: "No developer assigned to that project",
    project_already_exists: "Project with same name already exists",
    QA_not_assign_to_project:
      "You (with profession QA ) are not assigned to that project",
  },

  bug: {
    task_not_found: "Task not found",
    tasks_not_found: "Tasks not found",
    not_QA_of_task: "You are not QA of that task",
    task_already_exists: "Task with this title already exists",
    task_status_not_change: "Task's status does not change",
  },
};

module.exports = { ERRORS_MESSAGES, SUCCESS_MESSAGES, ERRORS_NAMES };
