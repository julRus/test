const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getComments,
  getArticles,
  postArticle,
  deleteArticle
} = require("../controllers/articles");

const { error405 } = require("../Errors/error-405");
// const { error405 } = require("../Errors/errors405");

console.log(error405);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticle)
  .all(error405);
//.all(error405);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(error405);

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(error405);

// articlesRouter.get("/:articles_id/not", (err, req, res, next) => {
//   res.status(404).json({ msg: "invalid path" });
// });

module.exports = { articlesRouter };
