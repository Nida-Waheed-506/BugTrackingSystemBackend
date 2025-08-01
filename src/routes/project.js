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

//create the project
projectRouter.post(
  "/project",
  userAuth,
  isManager,
  upload.single("image"),
  projectController.createProject
);
// get the project
projectRouter.get("/projects", userAuth, projectController.findProjects);
// update the project
projectRouter.patch(
  "/projects/:project_id",
  userAuth,
  isManager,
  projectController.updateProject
);
// delete the project
projectRouter.delete(
  "/projects/:project_id",
  userAuth,
  isManager,
  projectController.deleteProject
);

// assign the project

projectRouter.post(
  "/projects/:project_id/assign",
  userAuth,
  isManager,
  projectController.assignProject
);

// get the  developers

projectRouter.get(
  "/projects/:project_id/users/developers", userAuth , isQA,
  projectController.findUsersDevs
);

// get all the developers of the project

module.exports = { projectRouter };
