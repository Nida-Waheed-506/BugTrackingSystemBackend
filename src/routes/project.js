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

//create the project
projectRouter.post(
  "/project",

  isManager,
  upload.single("image"),
  projectController.createProject
);

// get the project
projectRouter.get("/project/:project_id", projectController.findProject);

// update the project
projectRouter.patch(
  "/project/:project_id",

  isManager,
  projectController.updateProject
);
// delete the project
projectRouter.delete(
  "/project/:project_id",

  isManager,
  projectController.deleteProject
);

// get the projects
projectRouter.get("/project", projectController.findProjects);

// assign the project

projectRouter.post(
  "/project/:project_id/assign",

  isManager,
  projectController.assignProject
);

// get the  developers

projectRouter.get(
  "/project/:project_id/users/developers",

  isQA,
  projectController.findUsersDevs
);

// is Manager belong to specific project

projectRouter.get(
  "/project/:project_id/IsManager",

  isManager,
  projectController.isProjectManager
);

module.exports = { projectRouter };
