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

    // That QA assign project to which developer which is already assigned to that project by manager

    // const isValidDevToProject = await Project.findOne({
    //   where : {id : project_id},
    //   include : {
    //     model : User,
    //     where : {id: developer_id , user_type:'developer'},
    //     through : {attributes:[]}
    //     }

    // });

    // if (!isValidDevToProject)
    //   throw new Error("To which developer you assign , it not exists ");

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

  findBugs = async (project_id) => {
    return await Project.findOne({
      where: { id: project_id },
      attributes: ["id", "projectName"],
      include: {
        model: Bug,
        attributes: [
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
      },
    });
  };

  changeBugStatus = async (project_id, id, status, user_id) => {
    const obj = await Bug.findOne({ where: { id: parseInt(id) } });
    if (!obj) throw new Error("This bug or feature not exist");
    statusValidator(obj.type, status);

    const isValidUser = await Bug.findOne({
      where: {
        project_id: project_id,
        [Op.or]: [
          { developer_id: { [Op.contains]: user_id } },
          { QA_id: user_id },
        ],
      },
    });
    if (!isValidUser)
      throw new Error("You are not assigned to the bug of that project");

    return await obj.update({ status: status });
  };
}

const bugHandlers = new BugHandlers();

module.exports = { bugHandlers };
