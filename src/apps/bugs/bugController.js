const { bugManager } = require("./bugManager");

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
      if (bug) res.status(201).json({ message: "Bug is created", data: bug });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          error: "Bug with this title already exists.",
        });
      }

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error:
            error.errors[0].message === "invalid date"
              ? error.errors[0].message
              : "Title , type , status must be filled",
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  findBugs = async (req, res, next) => {
    try {
      const { project_id } = req.body;

      const bugs = await bugManager.findBugs(project_id);

      if (bugs.length !== 0)
        res.json({ message: "Feature & Bugs of this project : ", data: bugs });
      else throw new Error("This project has no feature or bugs to list");
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  changeBugStatus = async (req, res, next) => {
    try {
      const { bug_id: id } = req.params;
      const { project_id, status } = req.body;
      const { id: user_id } = req.user;
      const bug = await bugManager.changeBugStatus(
        project_id,
        id,
        status,
        user_id.toString()
      );

      if (bug.length !== 0)
        res.json({ message: "Status of change successfully", data: bug });
      else throw new Error("Status does not change");
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };
}

const bugController = new BugController();

module.exports = {
  bugController,
};
