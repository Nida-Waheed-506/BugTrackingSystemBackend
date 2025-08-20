const STATIC_KEYWORDS = {
  cookieName: "token",
};

const USER_TYPES = {
  manager: "manager",
  developer: "developer",
  QA: "QA",
};

const BUGS_TYPES = {
  bug: {
    typeName: "bug",
    status: {
      new: "new",
      started: "started",
      resolved: "resolved",
    },
  },
  feature: {
    typeName: "feature",
    status: {
      new: "new",
      started: "started",
      completed: "completed",
    },
  },
};

const EMAIL_TYPE = {
  bug: "Bug",
  project: "Project",
};

module.exports = { STATIC_KEYWORDS, USER_TYPES, EMAIL_TYPE, BUGS_TYPES };
