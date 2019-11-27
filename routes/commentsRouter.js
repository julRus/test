const commentsRouter = require("express").Router();
const { patchComment, deleteComment } = require("../controllers/comments");
const { error405 } = require("../Errors/error-405");

commentsRouter
  .route("/:comments_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(error405);

commentsRouter.route("/").all(error405);

module.exports = { commentsRouter };
