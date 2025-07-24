const statusValidator = (type, status) => {
  if (type !== "feature" && type !== "bug")
    throw new Error("Type of bug must be feature or bug");
  if (
    type === "feature" &&
    status !== "new" &&
    status !== "started" &&
    status !== "completed"
  )
    throw new Error("Status must be in [new , started , completed]");
  else if (
    type === "bug" &&
    status !== "new" &&
    status !== "started" &&
    status !== "resolved"
  )
    throw new Error("Status must be in [new , started , resolved]");
};

module.exports = { statusValidator };
