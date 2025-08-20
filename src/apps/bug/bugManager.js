const { typeValidator, statusValidator } = require("../../utils/validation");
const { bugHandlers } = require("../../handlers/bugHandlers");
const { services } = require("../../services/services");
const { userHandlers } = require("../../handlers/userHandlers");
const { Project } = require("../../models/project");
const { User } = require("../../models/user");
const { ERRORS_MESSAGES } = require("../../utils/response_msg");
const { USER_TYPES, EMAIL_TYPE } = require("../../utils/constants");
const { Bug } = require("../../models/bug");
const { Op } = require("sequelize");
// +++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++

class BugManager {
  createBug = async (project_id, QA_id, screenshot, bugDetails) => {
    const { type, status } = bugDetails;

    typeValidator(type);
    if (status) {
      statusValidator(type, status);
    }
    //project exists or  not

    const project = await Project.findOne({
      where: { id: project_id },
    });
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    //QA is assigned to that project or not by the manager

    const isValidQAToProject = await Project.findOne({
      where: { id: project_id },
      include: {
        model: User,
        where: { id: QA_id, user_type: USER_TYPES.QA },
        through: { attributes: [] },
      },
    });

    if (!isValidQAToProject)
      throw new Error(ERRORS_MESSAGES.project.QA_not_assign_to_project);

    const bug = await bugHandlers.createBug(
      project,
      project_id,
      QA_id,
      screenshot,
      bugDetails
    );

    // send invite to user on email
    if (bug) {
      const { developer_id } = bug;

      developer_id.map(async (developer_id) => {
        const user = await userHandlers.getUser(parseInt(developer_id));

        services.sendEmail(user, bug, EMAIL_TYPE.bug);
      });
    }

    return bug;
  };

  editBug = async (bug_id, project_id, QA_id, screenshot, bugDetails) => {
    const { type, status } = bugDetails;

    typeValidator(type);
    if (status) {
      statusValidator(type, status);
    }

    // bug exists or not

    const bugExists = await Bug.findOne({ where: { id: bug_id } });
    if (!bugExists) throw new Error(ERRORS_MESSAGES.bug.task_not_found);
    //project exists or  not

    const project = await Project.findOne({
      where: { id: project_id },
    });
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    //QA is assigned to that project or not by the manager

    const isValidQAToProject = await Project.findOne({
      where: { id: project_id },
      include: {
        model: User,
        where: { id: QA_id, user_type: USER_TYPES.QA },
        through: { attributes: [] },
      },
    });

    if (!isValidQAToProject)
      throw new Error(ERRORS_MESSAGES.project.QA_not_assign_to_project);

    const bug = await bugHandlers.editBug(
      bugExists,
      project,

      project_id,
      QA_id,
      screenshot,
      bugDetails
    );

    if (bug) {
      const { developer_id } = bug;

      developer_id.map(async (developer_id) => {
        const user = await userHandlers.getUser(parseInt(developer_id));

        services.sendEmail(user, bug, USER_TYPES.QA);
      });
    }

    return bug;
  };

  deleteBug = async (project_id, QA_id, bug_id) => {
    //project exists or  not

    const project = await Project.findOne({
      where: { id: project_id },
    });
    if (!project) throw new Error(ERRORS_MESSAGES.project.project_not_found);

    //QA is assigned to that project or not by the manager

    const isValidQAToProject = await Project.findOne({
      where: { id: project_id },
      include: {
        model: User,
        where: { id: QA_id, user_type: USER_TYPES.QA },
        through: { attributes: [] },
      },
    });

    if (!isValidQAToProject)
      throw new Error(ERRORS_MESSAGES.project.QA_not_assign_to_project);

    const bug = await bugHandlers.deleteBug(bug_id);

    if (bug) {
      return await bug.destroy();
    } else {
      throw new Error(ERRORS_MESSAGES.bug.task_not_found);
    }
  };

  findBugs = async (project_id, limit, offset) => {
    return await bugHandlers.findBugs(project_id, limit, offset);
  };

  findBug = async (bug_id) => {
    return await bugHandlers.findBug(bug_id);
  };

  changeBugStatus = async (project_id, id, type, status, user_id) => {
    typeValidator(type);
    // bug status validator
    statusValidator(type, status);
    const obj = await Bug.findOne({ where: { id: id } });
    if (!obj) throw new Error(ERRORS_MESSAGES.bug.task_not_found);

    const isValidUser = await Bug.findOne({
      where: {
        project_id: project_id,
        id: id,
        [Op.or]: [
          { developer_id: { [Op.contains]: [user_id] } },
          { QA_id: user_id },
        ],
      },
    });

    if (!isValidUser)
      throw new Error(ERRORS_MESSAGES.project.QA_not_assign_to_project);
    return await bugHandlers.changeBugStatus(
      obj,

      status
    );
  };

  isQABelongToProject = async (project_id, QA_id) => {
    const projectExists = await Project.findOne({ where: { id: project_id } });
    if (!projectExists)
      throw new Error(ERRORS_MESSAGES.project.project_not_found);
    const isValidQAToProject = await bugHandlers.isQABelongToProject(
      project_id,
      QA_id
    );
    if (!isValidQAToProject)
      throw new Error(ERRORS_MESSAGES.project.QA_not_assign_to_project);

    return isValidQAToProject;
  };
  isQABelongToBug = async (project_id, bug_id, QA_id) => {
    const projectExists = await Project.findOne({ where: { id: project_id } });
    if (!projectExists)
      throw new Error(ERRORS_MESSAGES.project.project_not_found);

    const bugExists = await Bug.findOne({ where: { id: bug_id } });
    if (!bugExists) throw new Error(ERRORS_MESSAGES.bug.task_not_found);
    const bug = await bugHandlers.isQABelongToBug(project_id, bug_id, QA_id);
    if (!bug) throw new Error(ERRORS_MESSAGES.bug.not_QA_of_task);
    return bug;
  };
}

const bugManager = new BugManager();

module.exports = { bugManager };
