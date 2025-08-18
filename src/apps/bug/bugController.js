const { bugManager } = require("./bugManager");
const {
  http_response_status_codes,
} = require("../../utils/http_response_status_codes");
const {
  SUCCESS_MESSAGES,
  ERRORS_NAMES,
  ERRORS_MESSAGES,
} = require("../../utils/response_msg");
// +++++++++++++++++++++ imports end ++++++++++++++++++++++++++++++

class BugController {
  createBug = async (req, res, next) => {
    try {
      const { project_id } = req.body;

      const { id: QA_id } = req.user;

      const bug = await bugManager.createBug(
        project_id,
        QA_id,
        req?.file?.buffer,
        req.body
      );
      if (bug)
        res
          .status(http_response_status_codes.created)
          .json({ message: SUCCESS_MESSAGES.bug.task_create, data: bug });
    } catch (error) {
      if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
        return res.status(http_response_status_codes.conflict).json({
          error: ERRORS_MESSAGES.bug.task_already_exists,
        });
      } else if (
        error instanceof Error &&
        (ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
          ERRORS_MESSAGES.project.QA_not_assign_to_project ||
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
          ERRORS_MESSAGES.validation_errors.bug_status_invalid)
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        ERRORS_MESSAGES.project.project_not_found
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  editBug = async (req, res, next) => {
    try {
      const { bug_id } = req.params;
      const { project_id } = req.body;

      const { id: QA_id } = req.user;

      const bug = await bugManager.editBug(
        parseInt(bug_id),
        project_id,
        QA_id,
        req?.file?.buffer,
        req.body
      );
      if (bug)
        res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_update, data: bug });
    } catch (error) {
      if (error.name === ERRORS_NAMES.SequelizeUniqueConstraintError) {
        return res.status(http_response_status_codes.conflict).json({
          error: ERRORS_MESSAGES.bug.task_already_exists,
        });
      } else if (
        error instanceof Error &&
        (ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
          ERRORS_MESSAGES.project.QA_not_assign_to_project ||
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
          ERRORS_MESSAGES.validation_errors.bug_status_invalid)
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        (ERRORS_MESSAGES.project.project_not_found ||
          ERRORS_MESSAGES.bug.task_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  deleteBug = async (req, res, next) => {
    try {
      const { bug_id } = req.params;
      const { project_id } = req.query;

      const { id: QA_id } = req.user;

      const bug = await bugManager.deleteBug(project_id, QA_id, bug_id);
      if (bug)
        res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_delete });
    } catch (error) {
      if (
        error instanceof Error &&
        ERRORS_MESSAGES.project.QA_not_assign_to_project
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      } else if (
        error instanceof Error &&
        (ERRORS_MESSAGES.project.project_not_found ||
          ERRORS_MESSAGES.bug.task_not_found)
      ) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  findBugs = async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const offset = (page - 1) * limit;

    try {
      const { project_id } = req.query;

      const bugs = await bugManager.findBugs(
        parseInt(project_id),
        limit,
        offset
      );

      if (bugs.length !== 0)
        res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.bug.tasks_get, data: bugs });
      else throw new Error(ERRORS_MESSAGES.bug.tasks_not_found);
    } catch (error) {
      if (error instanceof Error && ERRORS_MESSAGES.bug.tasks_not_found) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  changeBugStatus = async (req, res, next) => {
    try {
      const { bug_id: id } = req.params;
      const { project_id, type, status } = req.body;
      const { id: user_id } = req.user;

      const bug = await bugManager.changeBugStatus(
        project_id,
        id,
        type,
        status,
        user_id.toString()
      );

      if (bug.length !== 0)
        res.status(http_response_status_codes.ok).json({
          message: SUCCESS_MESSAGES.bug.task_status_change,
          data: bug,
        });
      else throw new Error(ERRORS_MESSAGES.bug.task_status_not_change);
    } catch (error) {
      if (
        error instanceof Error &&
        (ERRORS_MESSAGES.validation_errors.bugs_types_invalid ||
          ERRORS_MESSAGES.validation_errors.feature_status_invalid ||
          ERRORS_MESSAGES.validation_errors.bug_status_invalid ||
          ERRORS_MESSAGES.project.QA_not_assign_to_project)
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      } else if (error instanceof Error && ERRORS_MESSAGES.bug.task_not_found) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  isQABelongToProject = async (req, res, next) => {
    try {
      const { id: QA_id } = req.user;
      const { project_id } = req.params;

      const project = await bugManager.isQABelongToProject(
        parseInt(project_id),
        parseInt(QA_id)
      );

      if (project)
        return res
          .status(http_response_status_codes)
          .json({ message: SUCCESS_MESSAGES.project.project_valid_QA });
    } catch (error) {
      if (
        error instanceof Error &&
        ERRORS_MESSAGES.project.QA_not_assign_to_project
      ) {
        return res
          .status(http_response_status_codes.bad_request)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };

  isQABelongToBug = async (req, res, next) => {
    try {
      const { id: QA_id } = req.user;
      const { project_id } = req.params;
      const { bug_id } = req.params;

      const bug = await bugManager.isQABelongToBug(
        parseInt(project_id),
        parseInt(bug_id),
        parseInt(QA_id)
      );

      if (bug)
        return res
          .status(http_response_status_codes)
          .json({ message: SUCCESS_MESSAGES.bug.task_valid_QA });
    } catch (error) {
      if (error instanceof Error && ERRORS_MESSAGES.bug.task_not_found) {
        return res
          .status(http_response_status_codes.not_found)
          .json({ error: error.message });
      }

      return res
        .status(http_response_status_codes.internal_server_error)
        .json({ error: ERRORS_MESSAGES.unexpected_error });
    }
  };
}

const bugController = new BugController();

module.exports = {
  bugController,
};
