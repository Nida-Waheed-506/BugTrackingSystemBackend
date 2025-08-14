const { Bug } = require("../models/bug");
const { statusValidator } = require("../utils/typeValidation");
const { Op } = require("sequelize");
const { Project } = require("../models/project");
const { User } = require("../models/user");
// +++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++

class BugHandlers {
  createBug = async (project_id, QA_id, screenshot, bugDetails) => {
    const { title, description, deadline, type, status, developer_id } =
      bugDetails;

    //project exists or  not

    const project = await Project.findOne({
      where: { id: parseInt(project_id) },
    });
    if (!project) throw new Error("Project not exists");

    //QA is assigned to that project or not by the manager

    const isValidQAToProject = await Project.findOne({
      where: { id: parseInt(project_id) },
      include: {
        model: User,
        where: { id: QA_id, user_type: "QA" },
        through: { attributes: [] },
      },
    });

    if (!isValidQAToProject)
      throw new Error(
        "You (with profession QA ) are not assigned to that project"
      );

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

  editBug = async (bug_id, project_id, QA_id, screenshot, bugDetails) => {
    const { title, description, deadline, type, status, developer_id } =
      bugDetails;

    // bug exists or not

    const bugExists = await Bug.findOne({ where: { id: bug_id } });
    if (!bugExists) throw new Error("Bug not exists");
    //project exists or  not

    const project = await Project.findOne({
      where: { id: parseInt(project_id) },
    });
    if (!project) throw new Error("Project not exists");

    //QA is assigned to that project or not by the manager

    const isValidQAToProject = await Project.findOne({
      where: { id: parseInt(project_id) },
      include: {
        model: User,
        where: { id: QA_id, user_type: "QA" },
        through: { attributes: [] },
      },
    });

    if (!isValidQAToProject)
      throw new Error(
        "You (with profession QA ) are not assigned to that project"
      );

    //Create the bug

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

  deleteBug = async (project_id, QA_id, bug_id) => {
    //project exists or  not

    const project = await Project.findOne({
      where: { id: parseInt(project_id) },
    });
    if (!project) throw new Error("Project not exists");

    //QA is assigned to that project or not by the manager

    const isValidQAToProject = await Project.findOne({
      where: { id: parseInt(project_id) },
      include: {
        model: User,
        where: { id: QA_id, user_type: "QA" },
        through: { attributes: [] },
      },
    });

    if (!isValidQAToProject)
      throw new Error(
        "You (with profession QA ) are not assigned to that project"
      );

    // DB query to delete the bug
    const bug = await Bug.findOne({ where: { id: bug_id } });

    if (bug) {
      return await bug.destroy();
    } else {
      throw new Error("Bug not exists");
    }
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

  changeBugStatus = async (project_id, id, status, user_id) => {
    const obj = await Bug.findOne({ where: { id: parseInt(id) } });
    if (!obj) throw new Error("This bug or feature not exist");

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
      throw new Error("You are not assigned to the bug of that project");

    return await obj.update({ status: status });
  };

  isQABelongToProject = async (project_id, QA_id) => {
    const isValidQAToProject = await Project.findOne({
      where: { id: parseInt(project_id) },
      include: {
        model: User,
        where: { id: QA_id, user_type: "QA" },
        through: { attributes: [] },
      },
    });

    if (!isValidQAToProject)
      throw new Error(
        "You (with profession QA ) are not assigned to that project"
      );

    return isValidQAToProject;
  };
  isQABelongToBug = async (project_id, bug_id, QA_id) => {
    const bug = await Bug.findOne({
      where: { project_id: project_id, id: bug_id, QA_id: QA_id },
    });
    if (!bug) throw new Error("You are not QA of that task");
    return bug;
  };
}

const bugHandlers = new BugHandlers();

module.exports = { bugHandlers };
