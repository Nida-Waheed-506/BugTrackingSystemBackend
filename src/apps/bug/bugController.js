const { bugManager } = require("./bugManager");
const {
  HTTP_RESPONSE_STATUS_CODES,
} = require("../../utils/httpResponseStatusCode");
const {
  SUCCESS_MESSAGES,
  ERRORS_NAMES,
  ERRORS_MESSAGES,
} = require("../../utils/response_msg");
const { SHOWN_ERRORS_Of_Bug } = require("../../utils/getError/bug");
const {
  validateBugData,
  projectIdValidator,
  bugIdValidator,
  paginationLimitValidator,
  paginationPageValidator,
} = require("../../utils/validation");
// +++++++++++++++++++++ imports end ++++++++++++++++++++++++++++++

class BugController {
  createBug = async (req, res, next) => {
    try {
      let { project_id } = req.body;

      const { id: QA_id } = req.user;

      project_id = projectIdValidator(project_id);

      validateBugData(req.body);

      const bug = await bugManager.createBug(
        project_id,
        QA_id,
        req?.file?.buffer,
        req.body
      );
      if (bug)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.created)
          .json({ message: SUCCESS_MESSAGES.bug.task_create, data: bug });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.createBugError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  editBug = async (req, res, next) => {
    try {
      let { bug_id } = req.params;
      let { project_id } = req.body;

      const { id: QA_id } = req.user;

      project_id = projectIdValidator(project_id);
      bug_id = bugIdValidator(bug_id);
      const bug = await bugManager.editBug(
        bug_id,
        project_id,
        QA_id,
        req?.file?.buffer,
        req.body
      );
      if (bug)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_update, data: bug });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.editBugError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  deleteBug = async (req, res, next) => {
    try {
      let { bug_id } = req.params;
      let { project_id } = req.query;

      const { id: QA_id } = req.user;

      project_id = projectIdValidator(project_id);
      bug_id = bugIdValidator(bug_id);

      const bug = await bugManager.deleteBug(project_id, QA_id, bug_id);
      if (bug)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_delete });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.deleteBugError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  findBugs = async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const offset = (page - 1) * limit;

    try {
      let { project_id } = req.query;

      paginationLimitValidator(limit);
      paginationPageValidator(page);
      project_id = projectIdValidator(project_id);

      const bugs = await bugManager.findBugs(project_id, limit, offset);

      if (bugs.length !== 0)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.bug.tasks_get, data: bugs });
      else throw new Error(ERRORS_MESSAGES.bug.tasks_not_found);
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.findBugsError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  findBug = async (req, res, next) => {
    try {
      let { bug_id } = req.params;

      bug_id = bugIdValidator(bug_id);

      const bug = await bugManager.findBug(bug_id);

      if (bug)
        res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_get, data: bug });
      else throw new Error(ERRORS_MESSAGES.bug.task_not_found);
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.findBugError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  changeBugStatus = async (req, res, next) => {
    try {
      let { bug_id: id } = req.params;
      let { type, status, project_id } = req.body;
      const { id: user_id } = req.user;

      id = bugIdValidator(id);

      project_id = projectIdValidator(project_id);

      const bug = await bugManager.changeBugStatus(
        project_id,
        id,
        type,
        status,
        user_id.toString()
      );

      if (bug.length !== 0)
        res.status(HTTP_RESPONSE_STATUS_CODES.ok).json({
          message: SUCCESS_MESSAGES.bug.task_status_change,
          data: bug,
        });
      else throw new Error(ERRORS_MESSAGES.bug.task_status_not_change);
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.changeBugStatusError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  isQABelongToProject = async (req, res, next) => {
    try {
      const { id: QA_id } = req.user;
      let { project_id } = req.params;

      project_id = projectIdValidator(project_id);

      const project = await bugManager.isQABelongToProject(project_id, QA_id);

      if (project)
        return res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.project.project_valid_QA });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.isQABelongToProjectError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };

  isQABelongToBug = async (req, res, next) => {
    try {
      const { id: QA_id } = req.user;
      let { project_id } = req.query;
      let { bug_id } = req.params;

      project_id = projectIdValidator(project_id);
      bug_id = bugIdValidator(bug_id);

      const bug = await bugManager.isQABelongToBug(project_id, bug_id, QA_id);

      if (bug)
        return res
          .status(HTTP_RESPONSE_STATUS_CODES.ok)
          .json({ message: SUCCESS_MESSAGES.bug.task_valid_QA });
    } catch (error) {
      const response_msg = SHOWN_ERRORS_Of_Bug.isQABelongToBugError(error);
      if (response_msg) {
        res.status(response_msg.statusCode).json({ error: response_msg.err });
      }
    }
  };
}

const bugController = new BugController();

module.exports = {
  bugController,
};
