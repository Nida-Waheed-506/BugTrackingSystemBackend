const express = require("express");
const projectRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { isManager } = require("../middleware/isManager");
const { projectController } = require("../apps/project/projectController");

const multer = require("multer");
const { isQA } = require("../middleware/isQA");
//configure multer to store files in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ++++++++++++++++++++ imports and configurations end +++++++++++++++++++++++++++++++++++++++++++++

// Api's call

projectRouter.use(userAuth);

projectRouter.post(
  "/project",
  isManager,
  upload.single("image"),
  projectController.createProject
);

projectRouter.get("/project/:project_id", projectController.findProject);

projectRouter.patch(
  "/project/:project_id",
  isManager,
  projectController.updateProject
);

projectRouter.delete(
  "/project/:project_id",
  isManager,
  projectController.deleteProject
);

projectRouter.get("/project", projectController.findProjects);

projectRouter.post(
  "/project/:project_id/assign",
  isManager,
  projectController.assignProject
);

projectRouter.get(
  "/project/:project_id/users/developers",
  isQA,
  projectController.findUsersDevs
);

projectRouter.get(
  "/project/:project_id/IsManager",
  isManager,
  projectController.isProjectManager
);

module.exports = { projectRouter };
