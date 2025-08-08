const { projectManager } = require("./projectManager");
// +++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++

class ProjectController {
  createProject = async (req, res, next) => {
    try {
      const project = await projectManager.createProject(
        req.body,
        req?.file?.buffer,
        req.user
      );

      if (project)
        res
          .status(201)
          .json({ message: "Project added successfully", data: project });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          error: "Project with same name already exists.",
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  findProjects = async (req, res) => {
    console.log("heeloo");
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    try {
      // get the project
      const { projects, count } = await projectManager.findProjects(
        limit,
        offset
      );
      if (projects) {
        res.status(200).json({
          message: "Projects Detail",
          data: [count, projects, req.user],
        });
      } else res.status(404).json({ error: "Projects No Found" });
    } catch (error) {
      //   Errors which thrown by Error instance
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  updateProject = async (req, res, next) => {
    try {
      const { project_id: projectId } = req.params;
      const { id: manager_id } = req.user;
      const project = await projectManager.updateProject(
        projectId,
        manager_id.toString(),
        req.body
      );

      if (project)
        res
          .status(200)
          .json({ message: "Project updated successfully", data: project });
    } catch (error) {
      // res.status(404).json({ error: error.message });
      //   Errors which thrown by Error instance
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  deleteProject = async (req, res, next) => {
    try {
      const { project_id: projectId } = req.params;

      const { id: manager_id } = req.user;
      const project = await projectManager.deleteProject(
        projectId,
        manager_id.toString()
      );
      if (project)
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      // res.status(404).json({ error: error.message });
      //   Errors which thrown by Error instance
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  assignProject = async (req, res, next) => {
    try {
      const { id: manager_id } = req.user;
      const { project_id } = req.params;
      const { email } = req.body;

      const projectAssigned = await projectManager.assignProject(
        manager_id,
        parseInt(project_id),
        email
      );
      if (projectAssigned)
        res.json({
          message: "User assigned to  project  successfully",
          data: projectAssigned,
        });
    } catch (error) {
      // res.status(400).json({ error: error.message }); //   Errors which thrown by Error instance
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  findUsersDevs = async (req, res, next) => {
    const { search: searchingName } = req.query;
    const { project_id } = req.params;

    try {
      if (searchingName) {
        const assignedUsers = await projectManager.findUsersDevs(
          parseInt(project_id),
          searchingName
        );
        console.log(assignedUsers);
        if (assignedUsers)
          res.status(200).json({
            message: "Developers Detail",
            data: Array.isArray(assignedUsers)
              ? assignedUsers
              : [assignedUsers],
          });
      } else {
        const assignedTopUsers = await projectManager.findUsersDevsTop(
          parseInt(project_id)
        );
        if (assignedTopUsers)
          res.status(200).json({
            message: "Developers Detail",
            data: assignedTopUsers,
          });
      }
    } catch (error) {
      // console.log(error);
      // res.status(404).json({ error: error.message });
      //   Errors which thrown by Error instance
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };

  isProjectManager = async (req, res, next) => {
    try {
      
      const { project_id } = req.params;
      const { id: manager_id } = req.user;
      const project = await projectManager.isProjectManager(
        parseInt(project_id),
        parseInt(manager_id)
      );
      if (project)
        res.status(200).json({ message: "You are  manager of that project" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unexpected error" });
    }
  };
}

const projectController = new ProjectController();

module.exports = {
  projectController,
};
