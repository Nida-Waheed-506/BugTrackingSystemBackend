const express = require("express");
const bugRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { isQA } = require("../middleware/isQA");
const { bugController } = require("../apps/bug/bugController");
const { isQAorDev } = require("../middleware/isQAorDev");
const multer = require("multer");
//configure multer to store files in memory ( RAM ) as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// +++++++++++++++++++++++++++++++ imports and configurations end ++++++++++++++++++++++++++++++++++

// Api's call

bugRouter.use(userAuth);

bugRouter.post(
  "/bug",
  isQA,
  upload.single("screenshot"),
  bugController.createBug
);

bugRouter.patch(
  "/bug/:bug_id",
  isQA,
  upload.single("screenshot"),
  bugController.editBug
);

bugRouter.get("/bug/:bug_id", bugController.findBug);

bugRouter.delete("/bug/:bug_id", isQA, bugController.deleteBug);

bugRouter.get("/bug", bugController.findBugs);

bugRouter.patch(
  "/bug/:bug_id/status",
  isQAorDev,
  bugController.changeBugStatus
);

bugRouter.get(
  "/bug/project/:project_id/QA/belong",
  isQA,
  bugController.isQABelongToProject
);

bugRouter.get("/bug/:bug_id/QA/belong", isQA, bugController.isQABelongToBug);

module.exports = { bugRouter };
