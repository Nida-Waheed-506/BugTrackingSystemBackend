const { typeValidator } = require("../../utils/typeValidation");
const { bugHandlers } = require("../../handlers/bugHandlers");
const { services } = require("../../services/services");
const { userHandlers } = require("../../handlers/userHandlers");

// +++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++

class BugManager {
  createBug = async (project_id, QA_id, screenshot, bugDetails) => {
    const { type } = bugDetails;

    typeValidator(type);

    const bug = await bugHandlers.createBug(
      project_id,
      QA_id,
      screenshot,
      bugDetails
    );

    if (bug) {
      const { developer_id } = bug;

      developer_id.map(async (developer_id) => {
        const user = await userHandlers.getUser(parseInt(developer_id));

        services.sendEmail(user, bug, "bug");
      });
    }

    return bug;
  };

  deleteBug = async(project_id, QA_id , bug_id)=>{
     return await bugHandlers.deleteBug(
      project_id,
      QA_id,
      parseInt(bug_id)
    );
  }


  findBugs = async (project_id,limit,offset) => {
    return await bugHandlers.findBugs(project_id,limit,offset);
  };

  changeBugStatus = async (project_id, id, status, user_id) => {
    return await bugHandlers.changeBugStatus(project_id, id, status, user_id);
  };
}

const bugManager = new BugManager();

module.exports = { bugManager };
