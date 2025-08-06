const express = require("express");
const bugRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { isQA } = require("../middleware/isQA");
const { bugController } = require("../apps/bugs/bugController");
const { isQAorDev } = require("../middleware/isQAorDev");
const multer = require("multer");
//configure multer to store files in memory ( RAM ) as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// +++++++++++++++++++++++++++++++ imports and configurations end ++++++++++++++++++++++++++++++++++

// Api's call

//bug created by the QA only
bugRouter.post(
  "/bug",
  userAuth,
  isQA,
  upload.single("screenshot"),
  bugController.createBug
);
//get the bugs of the project with detail
bugRouter.get("/bugs", userAuth, bugController.findBugs);
// delete the bug of the project
bugRouter.delete("/bugs/:bug_id" , userAuth, isQA , bugController.deleteBug );
//Developer & QA update the status
bugRouter.patch(
  "/bugs/:bug_id/status",
  userAuth,
  isQAorDev,
  bugController.changeBugStatus
);

module.exports = { bugRouter };
