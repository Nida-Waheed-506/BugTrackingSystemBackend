const express = require("express");
const authRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { SUCCESS_MESSAGES } = require("../utils/response_msg");

//++++++++++++++++++++++++++++++++ imports end +++++++++++++++++++++++++++++++++++++++++++

authRouter.use(userAuth);
authRouter.get("/me", async (req, res) => {
  res
    .status(200)
    .json({ message: SUCCESS_MESSAGES.user.user_get, data: req.user });
});
module.exports = { authRouter };
