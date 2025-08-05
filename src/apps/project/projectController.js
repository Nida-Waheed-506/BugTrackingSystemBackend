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
    try {
      // get the project
      const projects = await projectManager.findProjects();
      if (projects)
        res
          .status(200)
          .json({ message: "Projects Detail", data: [projects, req.user] });
    } catch (error) {
      res.status(404).json({ error: "Projects No Found" });
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
      res.status(404).json({ error: error.message });
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
      res.status(404).json({ error: error.message });
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
      res.status(400).json({ error: error.message });
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
      console.log(error);
      res.status(404).json({ error: error.message });
    }
  };
}

const projectController = new ProjectController();

module.exports = {
  projectController,
};
