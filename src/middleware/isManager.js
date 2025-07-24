const isManager = async (req, res, next) => {
  try {
    const { user_type } = req.user;
    if (user_type !== "manager")
      throw new Error("Only manager perform this action");
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { isManager };
