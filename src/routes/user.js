const express = require("express");
const userRouter = express.Router();
const { userController } = require("../apps/user/userController");
const { userAuth } = require("../middleware/userAuth");
const { isManager } = require("../middleware/isManager");
const { SUCCESS_MESSAGES } = require("../utils/response_msg");

//++++++++++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++++

// Api's call
userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.findUser);
userRouter.post("/logout", async (req, res) => {
  // expire the cookies
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.status(200).json({ message: SUCCESS_MESSAGES.user.user_logout });
});

userRouter.use(userAuth);

// get all users

userRouter.get("/user", isManager, userController.getUsers);

// get specific user

userRouter.get("/user/:id", userController.getUser);

// edit the specific user

userRouter.patch("/user/:id", userController.editUser);

// delete the specific user

userRouter.delete("/user/:id", userController.deleteUser);

module.exports = { userRouter };
