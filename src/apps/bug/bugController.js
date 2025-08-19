const { bugManager } = require("./bugManager");
const {
  http_response_status_codes,
} = require("../../utils/http_response_status_codes");
const {
  SUCCESS_MESSAGES,
  ERRORS_NAMES,
  ERRORS_MESSAGES,
} = require("../../utils/response_msg");
const { SHOWN_ERRORS_Of_Bug } = require("../../utils/showError/bug");
const { validateBugData } = require("../../utils/validation");
// +++++++++++++++++++++ imports end ++++++++++++++++++++++++++++++

class BugController {
  createBug = async (req, res, next) => {
    try {
      const { project_id } = req.body;

      const { id: QA_id } = req.user;

      validateBugData(req.body);

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
      SHOWN_ERRORS_Of_Bug.createBug_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
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
      SHOWN_ERRORS_Of_Bug.editBug_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
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
      SHOWN_ERRORS_Of_Bug.deleteBug_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
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
      SHOWN_ERRORS_Of_Bug.findBugs_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
    }
  };

  findBug = async (req, res, next) => {
    try {
      const { bug_id } = req.params;

      const bug = await bugManager.findBug(parseInt(bug_id));

      if (bug)
        res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_get, data: bug });
      else throw new Error(ERRORS_MESSAGES.bug.task_not_found);
    } catch (error) {
      SHOWN_ERRORS_Of_Bug.findBug_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
    }
  };

  changeBugStatus = async (req, res, next) => {
    try {
      const { bug_id: id } = req.params;
      const { type, status, project_id } = req.body;
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
      SHOWN_ERRORS_Of_Bug.changeBugStatus_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
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
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.project.project_valid_QA });
    } catch (error) {
      SHOWN_ERRORS_Of_Bug.isQABelongToProject_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
    }
  };

  isQABelongToBug = async (req, res, next) => {
    try {
      const { id: QA_id } = req.user;
      const { project_id } = req.query;
      const { bug_id } = req.params;

      const bug = await bugManager.isQABelongToBug(
        parseInt(project_id),
        parseInt(bug_id),
        parseInt(QA_id)
      );

      if (bug)
        return res
          .status(http_response_status_codes.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_valid_QA });
    } catch (error) {
      SHOWN_ERRORS_Of_Bug.isQABelongToBug_error(error, res);
      SHOWN_ERRORS_Of_Bug.unexpected_error(res);
    }
  };
}

const bugController = new BugController();

module.exports = {
  bugController,
};
