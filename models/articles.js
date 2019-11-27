const connection = require("../db/connection");

exports.fetchArticleById = id => {
  return connection("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .groupBy("articles.article_id")
    .select("articles.*")
    .where("articles.article_id", id)
    .first()
    .then(article => {
      // console.table(article);
      if (!article) {
        return Promise.reject({ status: 404, msg: `article ${id} not found` });
      } else return article;
    });
};

exports.updateArticleById = (id, incrementation = 0) => {
  return connection("articles")
    .where("article_id", id)
    .increment("votes", incrementation)
    .returning("*")
    .then(article => {
      // console.log(article);
      if (article.length === 0)
        return Promise.reject({
          status: 404,
          msg: `article ${id} not found`
        });
      return article[0];
    });
};

exports.createComment = (id, user, comment) => {
  return connection("articles")
    .where("article_id", id)
    .first()
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `article_id ${id} not found`
        });
      } else {
        return connection("comments")
          .insert({
            body: comment,
            article_id: id,
            author: user
          })
          .returning("*")
          .then(res => {
            return res[0];
          });
      }
    });
};

exports.fetchComments = (
  id,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  page = 0
) => {
  return (
    connection("comments")
      .select(
        "author",
        "body",
        "comment_id",
        "votes",
        "created_at",
        "article_id"
      )
      .where("article_id", id)
      .returning("*")
      .orderBy(sort_by, order)
      .limit(limit)
      // .offset((page - 1) * limit)
      .modify(query => {
        if (page > 0) query.offset((page - 1) * limit);
      })
      .then(comments => {
        if (Math.sign(id) === -1 || id > 36)
          return Promise.reject({
            status: 404,
            msg: `article_id ${id} not found`
          });
        return comments;
      })
  );
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  page = 0,
  { author, topic }
) => {
  return (
    connection("articles")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .count({ comment_count: "comments.comment_id" })
      .groupBy("articles.article_id")
      .select(
        "articles.article_id",
        "articles.author",
        "articles.created_at",
        "articles.title",
        "articles.topic",
        "articles.votes"
      )
      .orderBy(sort_by, order)
      .limit(limit)
      // .groupBy("articles.article_id")
      .modify(query => {
        if (author) query.where("articles.author", author);
        if (topic) query.where("articles.topic", topic);
        // if (page === 2) query.limit(10).offset(10);
        if (page > 0) query.offset((page - 1) * limit);
      })
      .then(res => {
        if (res.length === 0)
          return Promise.reject({
            status: 404,
            msg: "query search term does not exist in data"
          });
        return res;
      })
  );
};

exports.createArticle = (title, body, topic, author) => {
  // console.log("MEMEMEMEME");
  return connection("articles")
    .insert({ title: title, body: body, topic: topic, author: author })
    .returning("*")
    .then(comments => {
      return comments[0];
    });
};

exports.removeArticles = id => {
  return connection("articles")
    .where("article_id", id)
    .delete();
};

// PATCH ARTICLE - 400:BAD REQ
// PATCH ARTICLE - 404:NOT FOUND
// ARTICLE - 500:INTERNAL SERVER ERROR
