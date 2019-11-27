const topicsRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topics");
const { error405 } = require("../Errors/error-405");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(error405);

module.exports = { topicsRouter };
