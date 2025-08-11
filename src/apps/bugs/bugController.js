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
        console.log(error.name);
        return res.status(400).json({
          error: error.errors[0].message,
           
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
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
          .status(201)
          .json({ message: "Bug is updated successfully", data: bug });
    } catch (error) {
      console.log(error);
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

  deleteBug = async (req, res, next) => {
    try {
      const { bug_id } = req.params;
      const { project_id } = req.query;

      const { id: QA_id } = req.user;

      const bug = await bugManager.deleteBug(project_id, QA_id, bug_id);
      if (bug) res.status(201).json({ message: "Bug deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  findBugs = async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    console.log(page, limit);
    const offset = (page - 1) * limit;

    try {
      const { project_id } = req.query;

      const bugs = await bugManager.findBugs(
        parseInt(project_id),
        limit,
        offset
      );

      if (bugs.length !== 0)
        res.json({ message: "Feature & Bugs of this project : ", data: bugs });
      else throw new Error("This project has no feature or bugs to list");
    } catch (error) {
      // console.log(error);
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
      console.log(id, project_id, status);
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
      // console.log(error);
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  isQABelongToProject = async (req, res, next) => {
    try {
      console.log("fj");
      const { id: QA_id } = req.user;
      const { project_id } = req.params;
      console.log(QA_id, project_id);
      const project = await bugManager.isQABelongToProject(
        parseInt(project_id),
        parseInt(QA_id)
      );

      if (project)
        return res
          .status(200)
          .json({ message: "You are the QA of that project" });
    } catch (error) {
      console.log("hello");
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  isQABelongToBug = async (req, res, next) => {
    try {
      const { id:QA_id } = req.user;
      const { project_id } = req.params;
      const { bug_id } = req.params;

      const bug = await bugManager.isQABelongToBug(
        parseInt(project_id),
        parseInt(bug_id),
        parseInt(QA_id)
      );

      if (bug) return res.status(200).json({ message: "You QA edit the task" });
    } catch (error) {
      // console.log(error);
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
