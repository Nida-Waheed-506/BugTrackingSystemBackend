const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    //read token form the cookies (attach with request)

    const { token } = req.cookies;

    // validate the token
    if (!token) return res.status(401).json({ error: "Login again" });

    //if token is valid then return object
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id } = decodedObj;
    // find by id that user exist or not
    const user = await User.findOne({ where: { id: id } });
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
