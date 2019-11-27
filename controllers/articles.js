const {
  fetchArticleById,
  updateArticleById,
  createComment,
  fetchComments,
  fetchArticles,
  createArticle,
  removeArticles
} = require("../models/articles.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(article => {
      // console.log(article, "<<<<<<<<<< CONTROLLER!");
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  // console.log(typeof req.body.body);
  const { username, body } = req.body;
  const { article_id } = req.params;
  createComment(article_id, username, body)
    .then(comment => {
      res.status(201).json({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  const { sort_by, order, limit, page } = req.query;
  fetchComments(article_id, sort_by, order, limit, page)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, limit, page, ...query } = req.query;
  fetchArticles(sort_by, order, limit, page, query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { title, body, topic, author } = req.body;
  createArticle(title, body, topic, author).then(comment => {
    res.status(201).send({ comment });
  });
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticles(article_id).then(response => {
    res.sendStatus(204);
  });
};
