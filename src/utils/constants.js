const static_keywords = {
  cookie_name: "token",
};

const user_types = {
  manager: "manager",
  developer: "developer",
  QA: "QA",
};

const bugs_types = {
  bug: {
    type_name: "bug",
    status: {
      new: "new",
      started: "started",
      resolved: "resolved",
    },
  },
  feature: {
    type_name: "feature",
    status: {
      new: "new",
      started: "started",
      completed: "completed",
    },
  },
};

const email_type = {
  bug: "Bug",
  project: "Project",
};

module.exports = { static_keywords, user_types, email_type, bugs_types };
