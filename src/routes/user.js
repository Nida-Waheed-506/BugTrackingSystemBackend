const express = require("express");
const userRouter = express.Router();
const { userController } = require("../apps/user/userController");
const { userAuth } = require("../middleware/userAuth");
const { isManager } = require("../middleware/isManager");

//++++++++++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++++

// Api's call
userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.findUser);
userRouter.post("/logout", async (req, res) => {
  // expire the cookies
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.status(200).json({ message: "Logout successfully" });
});
userRouter.get("/users", userAuth, isManager, userController.getUsers);

userRouter.get("/auth", userAuth, async(req,res)=>{
  res.status(200).json({message : "Logged In user detail" , data: req.user});
});
module.exports = { userRouter };
