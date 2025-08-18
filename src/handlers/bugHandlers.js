const { Bug } = require("../models/bug");
const { statusValidator } = require("../utils/validation");
const { Op } = require("sequelize");
const { Project } = require("../models/project");
const { User } = require("../models/user");
const { user_types } = require("../utils/constants");
// +++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++

class BugHandlers {
  createBug = async (project, project_id, QA_id, screenshot, bugDetails) => {
    const { title, description, deadline, type, status, developer_id } =
      bugDetails;

    //Create the bug

    const bug = await Bug.create({
      title: title,
      description: description,
      deadline: deadline,
      screenshot: screenshot,
      type: type,
      status: status,
      project_id: parseInt(project_id),
      QA_id: QA_id,
      developer_id: JSON.parse(developer_id),
    });

    await project.addBug(bug);
    return bug;
  };

  editBug = async (
    bugExists,
    project,
    project_id,
    QA_id,
    screenshot,
    bugDetails
  ) => {
    const { title, description, deadline, type, status, developer_id } =
      bugDetails;

    //Update the bug

    const bug = await bugExists.update({
      title: title,
      description: description,
      deadline: deadline,
      screenshot: screenshot,
      type: type,
      status: status,
      project_id: parseInt(project_id),
      QA_id: QA_id,
      developer_id: JSON.parse(developer_id),
    });

    await project.addBug(bug);
    return bug;
  };

  deleteBug = async (bug_id) => {
    // DB query to delete the bug
    const bug = await Bug.findOne({ where: { id: bug_id } });

    return bug;
  };

  findBugs = async (project_id, limit, offset) => {
    return await Bug.findAndCountAll({
      where: { project_id: project_id },
      limit,
      offset,
      attributes: [
        "id",
        "title",
        "description",
        "deadline",
        "screenshot",
        "type",
        "status",
        "project_id",
        "QA_id",
        "developer_id",
      ],
    });
  };

  changeBugStatus = async (obj, status) => {
    return await obj.update({ status: status });
  };

  isQABelongToProject = async (project_id, QA_id) => {
    const isValidQAToProject = await Project.findOne({
      where: { id: parseInt(project_id) },
      include: {
        model: User,
        where: { id: QA_id, user_type: user_types.QA },
        through: { attributes: [] },
      },
    });

    return isValidQAToProject;
  };
  isQABelongToBug = async (project_id, bug_id, QA_id) => {
    const bug = await Bug.findOne({
      where: { project_id: project_id, id: bug_id, QA_id: QA_id },
    });

    return bug;
  };
}

const bugHandlers = new BugHandlers();

module.exports = { bugHandlers };
