const isQAorDev = async (req, res, next) => {
  try {
    const { user_type } = req.user;

    if (user_type !== "developer" && user_type !== "QA")
      throw new Error("Only QA and Developer perform this action");
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { isQAorDev };
