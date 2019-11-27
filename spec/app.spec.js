process.env.NODE_ENV = "test";
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app");
const connection = require("../db/connection");

chai.use(require("sams-chai-sorted"));

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("GET:200 - Returns all topics from topics table", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics.length).to.equal(3);
          expect(topics).to.eql([
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" }
          ]);
        });
    });
  });
  describe("/topics-errors", () => {
    it("ERROR: 404 - Returns status code 404 along with a msg: 'invalid path' when given an invalid path", () => {
      return request(app)
        .get("/api/not-a-path")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("ERROR: 404 - path not found");
        });
    });
    it("ERROR:405 - invalid methods", () => {
      const methods = ["put", "patch", "delete"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
      return Promise.all(methodPromises);
    });
  });
  describe("/users/:username", () => {
    it("GET:200 - Returns a single user object by given username", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          // console.log(user);
          expect(user).to.be.an("object");
          expect(user).to.have.keys(["username", "name", "avatar_url"]);
        });
    });
  });
  describe("/users/:username-errors", () => {
    it("ERROR:404 - Returns status code 404 and a msg user not found when an username is passed which does not exist in the db", () => {
      const username = undefined;
      return request(app)
        .get(`/api/users/${username}`)
        .expect(404)
        .then(res => {
          // console.log(user);
          expect(res.body.msg).to.be.equal(`"user "${username}" not found"`);
        });
    });
    it("ERROR:405 - invalid methods", () => {
      const methods = ["post", "put", "patch", "delete"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/users/butter_bridge")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
      return Promise.all(methodPromises);
    });
  });
  describe("/articles/:article_id", () => {
    it("GET:200 - Returns status code 200 and a article by its id", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("object");
        });
    });
    it("GET:200 - Returns status code 200 and a article by its id AND the a total count of comments made towards this article", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("object");
          expect(article).to.have.keys([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
          expect(article.comment_count).to.equal("13");
        });
    });
    it("PATCH:200 - Returns status code 200 and an article whose votes have been updated to match the origional votes plus the given votes (incremented)", () => {
      return request(app)
        .patch(`/api/articles/1`)
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          ]);
          expect(article.votes).to.equal(99);
          // console.log(article.votes);
        });
    });
    it("PATCH:200 - Returns status code 200 and an article whose votes have been updated to match the origional votes plus the given votes (incremented) defaulting to 0 if no req or invalid req given", () => {
      return request(app)
        .patch(`/api/articles/1`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          ]);
          expect(article.votes).to.equal(100);
          // console.log(article.votes);
        });
    });
  });
  describe("/articles/:article_id-errors", () => {
    it("ERROR:400 - Returns psql error with status 400 and a msg 'Bad request, invalid data type'", () => {
      return request(app)
        .get(`/api/articles/not-a-number`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "not-a-number"'
          );
        });
    });
    it("ERROR:404 - Returns modified error with status 404 and a msg 'article does not exist'", () => {
      const id = -10;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(`article ${id} not found`);
        });
    });
    it("ERROR:404 - invalid path", () => {
      return request(app)
        .patch(`/api/not-a-path`)
        .send({
          inc_votes: 2
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("ERROR: 404 - path not found");
        });
    });
    it("ERROR:400 - when given a id of incorrect data type for patch", () => {
      return request(app)
        .patch(`/api/articles/not-a-num`)
        .send({
          inc_votes: 2
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "not-a-num"'
          );
        });
    });
    it("ERROR:404 - when given a id that does not exist for patch", () => {
      const id = -10;
      return request(app)
        .patch(`/api/articles/${id}`)
        .send({
          inc_votes: 2
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(`article ${id} not found`);
        });
    });
    // it("ERROR:400 - Returns psql error with status 400 and a msg 'bad request' when given a patch request in the incorrect format", () => {
    //   return request(app)
    //     .patch(`/api/articles/1`)
    //     .send({
    //       inc_votes: "not-a-number!!!!!!"
    //     })
    //     .expect(400)
    //     .then(res => {
    //       expect(res.body.msg).to.equal(
    //         'invalid input syntax for integer: "NaN"'
    //       );
    //     });
    // });
    // it("ERROR:500 - Returns an interanl server error with status 500", () => {});
    it("ERROR:405 - invalid methods", () => {
      const methods = ["post", "put"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/articles/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
      return Promise.all(methodPromises);
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("POST:201 - Returns status code 201 along with a newlwy created comment", () => {
      return request(app)
        .post(`/api/articles/1/comments`)
        .send({
          username: "butter_bridge",
          body: "S'alright"
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          expect(comment).to.be.an("object");
          expect(comment).to.have.keys([
            "comment_id",
            "body",
            "votes",
            "article_id",
            "author",
            "created_at"
          ]);
          expect(comment.author).to.equal("butter_bridge");
          expect(comment.body).to.equal("S'alright");
        });
    });
    it("GET:200 - Returns status code 200 along with an array of comments by a given article_id", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.an("array");
          expect(comments.length).to.equal(10);
          comments.forEach(comment => {
            expect(comment).to.have.keys([
              "comment_id",
              "body",
              "votes",
              "author",
              "created_at",
              "article_id"
            ]);
          });
          // Why is my new comment not added?
        });
    });

    it("GET:200 - Returns an empty array if given article by article id has no comments", () => {
      return request(app)
        .get(`/api/articles/2/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          console.log(comments);
          expect(comments).to.be.an("array");
          expect(comments.length).to.equal(0);
          // Why is my new comment not added?
        });
    });

    it("GET:200 - Returns status code 200 along with an array of comments sorted by a defeault of created_at", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.descendingBy("created_at");
          // Why is my new comment not added?
        });
    });
    it("GET:200 - Returns status code 200 along with an array of comments sorted by a given property", () => {
      return request(app)
        .get(`/api/articles/1/comments?sort_by=author`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.descendingBy("author");
          // Why is my new comment not added?
        });
    });
    it("GET:200 - Returns status code 200 along with an array of comments sorted by a given order defaulting to descending", () => {
      return request(app)
        .get(`/api/articles/1/comments?sort_by=votes&order=asc`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.ascendingBy("votes");
          // Why can't i sort by text body????
        });
    });
  });
  describe("/articles/:article_id/comments-errors", () => {
    it("ERROR:400 - when given an invalid data type for the article id", () => {
      return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "not-a-number"'
          );
        });
    });
    it("ERROR:404 - when given an article id that doesn't exist", () => {
      const id = -1;
      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(`article_id ${id} not found`);
        });
    });
    // it("ERROR:404 - when given an invalid path/ endpoint", () => {
    //   return request(app)
    //     .get(`/api/articles/1/not-an-endpoint`)
    //     .expect(404)
    //     .then(res => {
    //       console.log(res);
    //       expect(res.body.msg).to.equal(`invalid path`);
    //     });
    // });
    it("ERROR:404 - invalid path on post", () => {
      return request(app)
        .post(`/api/not-a-path`)
        .send({
          username: "butter_bridge",
          body: "hi"
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(`ERROR: 404 - path not found`);
        });
    });
    it("ERROR:400 - when an id of incorrect data type is past on the post", () => {
      return request(app)
        .post(`/api/articles/not-a-num/comments`)
        .send({
          username: "butter_bridge",
          body: "S'alright"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            `invalid input syntax for integer: "not-a-num"`
          );
        });
    });
    it("ERROR:400 - when given an invalid request for post that violates non-null contraint", () => {
      return request(app)
        .post(`/api/articles/1/comments`)
        .send({
          username: undefined,
          body: undefined,
          age: 10
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            `null value in column "body" violates not-null constraint`
          );
        });
    });
    it("ERROR:400 - when given an invalid request for post that violates key contraint (must be an existing user", () => {
      return request(app)
        .post(`/api/articles/1/comments`)
        .send({
          username: "someone",
          body: "not true"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            `insert or update on table "comments" violates foreign key constraint "comments_author_foreign"`
          );
        });
    });
    it("ERROR:400 - when given an incomplete request body", () => {
      return request(app)
        .post(`/api/articles/1/comments`)
        .send({
          username: "someone"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            `null value in column "body" violates not-null constraint`
          );
        });
    });
    it("ERROR:400 - when given an incomplete request body", () => {
      return request(app)
        .post(`/api/articles/1/comments`)
        .send({
          body: "bib"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            `null value in column "author" violates not-null constraint`
          );
        });
    });
    it("ERROR:404 - when given an article id that doesn't exist", () => {
      const id = -1;
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({
          username: "icellusedkars",
          body: "Hello my name is brian"
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(`article_id ${id} not found`);
        });
    });
    // it("ERROR:400 - when given an invalid request type", () => {
    //   const req = {
    //     username: "butter_bridge",
    //     body: [{ 1: { 2: [8, 9] } }, 2, 3]
    //   };
    //   return request(app)
    //     .post(`/api/articles/1/comments`)
    //     .send(req)
    //     .expect(400)
    //     .then(res => {
    //       expect(res.body.msg).to.equal(`invalid request`);
    //     });
    // });
    it("ERROR:405 - invalid methods", () => {
      const methods = ["put", "patch", "delete"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
      return Promise.all(methodPromises);
    });
    it("ERROR:500 - internal server error", () => {});
  });
  describe("/articles/:article_id/comments?query-errors", () => {
    it("ERROR:400 - when given an invalid data type for the sort_by query", () => {
      return request(app)
        .get("/api/articles/2/comments?sort_by=1")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('column "1" does not exist');
        });
    });
    // it("ERROR:404 - when given an data type for the sort_by query", () => {
    //   return request(app)
    //     .get("/api/articles/2/comments?sort_by=1")
    //     .expect(400)
    //     .then(res => {
    //       expect(res.body.msg).to.equal('column "1" does not exist');
    //     });
    // });
  });
  describe("/articles", () => {
    it("GET:200 - returns an array of articles each with added comments_count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("array");
          articles.forEach(article => {
            expect(article).to.have.keys(
              "article_id",
              "title",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
          });
        });
    });
    it("GET:200 - returns an array of articles sorted by created_at", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("created_at");
        });
    });
    it("GET:200 - returns an array of articles sorted by a given existing property", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("votes");
        });
    });
    it("GET:200 - returns an array of articles sorted by a given existing property and by a given order defaulting to descending", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.ascendingBy("author");
        });
    });
    it("GET:200 - returns an array of articles filtered by a given username(author) query", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(6);
          articles.forEach(article => {
            expect(article.author).to.equal("icellusedkars");
          });
        });
    });
    it("GET:200 - returns an array of articles filtered by a given topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(10);
          articles.forEach(article => {
            expect(article.topic).to.equal("mitch");
          });
        });
    });
    it("GET:200 - returns an array of articles filtered by a given author and topic query", () => {
      return request(app)
        .get("/api/articles?author=rogersop&topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(2);
          articles.forEach(article => {
            expect(article.topic).to.equal("mitch");
            expect(article.author).to.equal("rogersop");
          });
        });
    });
  });
  describe("/articles?query-errors", () => {
    it("ERROR:404, when given an invalid path", () => {
      return request(app)
        .get("/api/not-a-path")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("ERROR: 404 - path not found");
        });
    });
    it("ERROR:400, when given a collumn that does not exist for sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=1")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('column "1" does not exist');
        });
    });
    it("ERROR:404, when given a author that does not exist", () => {
      return request(app)
        .get("/api/articles?author=1")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(
            "query search term does not exist in data"
          );
        });
    });
    it("ERROR:404, when given a author or topic that does not exist", () => {
      return request(app)
        .get("/api/articles?topic=1")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(
            "query search term does not exist in data"
          );
        });
    });
    // it("ERROR:404, when given a author or topic that does not exist", () => {
    //   return request(app)
    //     .get("/api/articles?people=1")
    //     .expect(404)
    //     .then(res => {
    //       expect(res.body.msg).to.equal(
    //         "query search term does not exist in data"
    //       );
    //     });
    // });
    it("ERROR:405 - invalid methods", () => {
      const methods = ["put", "patch", "delete"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
      return Promise.all(methodPromises);
    });
  });
  describe("/comments/:comment-id", () => {
    it("PATCH:200 - successfully updates the votes by a given amount (increment)", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).to.be.an("object");
          expect(comment.votes).to.equal(18);
        });
    });
    it("PATCH:200 - successfully updates the votes by a given amount (decrement)", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -2 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).to.be.an("object");
          expect(comment.votes).to.equal(14);
        });
    });
    it("PATCH:200 - returns unchanged comment when inc_votes is not specified", () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).to.be.an("object");
          expect(comment.votes).to.equal(16);
        });
    });
    it("DELETE:204 - successfully deletes a comment and all its information by its given id, doesn't return any content", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then(res => {
          return request(app)
            .delete("/api/comments/2")
            .expect(404);
        });
    });
  });
  describe("/comments/:comments_id-errors", () => {
    it("ERROR:404 - invalid path on patch", () => {
      return request(app)
        .patch("/api/not-a-path")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("ERROR: 404 - path not found");
        });
    });
    it("ERROR:400 - when given an id of incorrect data type", () => {
      return request(app)
        .patch("/api/comments/not-a-number")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "not-a-number"'
          );
        });
    });
    it("ERROR:404 - when given an id that doesn't exist", () => {
      const id = -10;
      return request(app)
        .patch(`/api/comments/${id}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(`comment ${id} does not exist`);
        });
    });
    it("ERROR:400 - when given an invalid patch request body data type", () => {
      return request(app)
        .patch(`/api/comments/1`)
        .send({
          inc_votes: "two"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "NaN"'
          );
        });
    });
    it("ERROR:404 - invalid path on delete", () => {
      return request(app)
        .delete(`/api/not-a-path`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("ERROR: 404 - path not found");
        });
    });
    it("ERROR:400 - when given an invalid id on delete", () => {
      return request(app)
        .delete(`/api/comments/not-a-num`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "not-a-num"'
          );
        });
    });
    it("ERROR:404 - when given an id that doesn't exist on delete", () => {
      const id = -10;
      return request(app)
        .delete(`/api/comments/${id}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(
            `comments with id "${id}" does not exist`
          );
        });
    });
    it("ERROR:405 - invalid methods", () => {
      const methods = ["put"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
      return Promise.all(methodPromises);
    });
  });
  describe("/api - get/api", () => {
    it("GET:200 - Returns a json describing all the available endpoints of my api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).to.be.an("object");
        });
    });
  });
  describe("ERROR405", () => {
    it("Ensures no methods other than get are allowed on the api path!", () => {
      const methods = ["post", "put", "patch", "delete"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
      return Promise.all(methodPromises);
    });
  });

  describe("/articles - Pagnation", () => {
    it("GET:200 - Limit query default to 10", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(10);
        });
    });
    it("GET:200 - Limit query of a given amount", () => {
      return request(app)
        .get("/api/articles?limit=6")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(6);
        });
    });
    it("GET:200 - page query default to one", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          // console.log(articles);
          expect(articles.length).to.equal(10);
          // expect(articles.total_count).to.equal(10);
          // expect(articles[0]).to.eql({
          //   comment_count: "13",
          //   article_id: 1,
          //   author: "butter_bridge",
          //   created_at: "2018-11-15T12:21:54.171Z",
          //   title: "Living in the shadow of a great man",
          //   topic: "mitch",
          //   votes: 100
          // });
          // expect(articles[articles.length - 1]).to.eql({
          //   comment_count: "0",
          //   article_id: 10,
          //   author: "rogersop",
          //   created_at: "1982-11-24T12:21:54.171Z",
          //   title: "Seven inspirational thought leaders from Manchester UK",
          //   topic: "mitch",
          //   votes: 0
          // });
        });
    });
    // it("GET:200 - page query", () => {
    //   return request(app)
    //     .get("/api/articles?page=2")
    //     .expect(200)
    //     .then(({ body: { articles } }) => {
    //       // console.log(articles);
    //       expect(articles.length).to.equal(2);
    //     });
    // });
    it("GET:200 - page query with limit", () => {
      return request(app)
        .get("/api/articles?limit=3&page=2")
        .expect(200)
        .then(({ body: { articles } }) => {
          // console.log(articles);
          // console.log(articles);
          expect(articles.length).to.equal(3);
          expect(articles[0]).to.eql({
            comment_count: "0",
            article_id: 4,
            author: "rogersop",
            created_at: "2006-11-18T12:21:54.171Z",
            title: "Student SUES Mitch!",
            topic: "mitch",
            votes: 0
          });
        });
    });
    //   it("GET:200 - has a total_articles property default to 10", () => {
    //     return request(app)
    //       .get("/api/articles")
    //       .expect(200)
    //       .then(({ body: { articles } }) => {
    //         // console.log(articles);
    //         expect(articles.length).to.equal(10);
    //         expect(articles.total_articles).to.equal(10);
    //       });
    //   });
  });
  describe("/articles/:article-id/comments - Pagnation", () => {
    it("GET:200 - Returns comments limited to 10", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comments);
          expect(comments.length).to.equal(10);
        });
    });
    it("GET:200 - Returns comments limited to a given limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comments);
          expect(comments.length).to.equal(5);
        });
    });
    it("GET:200 - Returns comments limited to a given limit query and page", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5&page=2")
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comments);
          expect(comments.length).to.equal(5);
          expect(comments[0]).to.eql({
            article_id: 1,
            author: "icellusedkars",
            body: "Lobster pot",
            comment_id: 7,
            votes: 0,
            created_at: "2011-11-24T12:36:03.389Z"
          });
        });
    });
  });

  describe("/aticles - POST", () => {
    it("POST:201 - Returns a nelwy posted comment", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "A test article",
          body: "This is an article made to test article post method",
          topic: "cats",
          author: "rogersop"
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).to.be.an("object");
          expect(comment).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          ]);
          // expect(comments.length).to.equal(10);
        });
    });
  });

  describe("/articles/:article-id - DELETE", () => {
    it("DELETE:204 - Deletes an article", () => {
      return request(app)
        .delete("/api/articles/4")
        .expect(204);
    });
  });
  describe("/topics - POST", () => {
    it("POST:201 - Posts a new topic", () => {
      return request(app)
        .post("/api/topics")
        .send({
          slug: "Outer Sapce, Inner Space",
          description:
            "The endless void that stretches out far and wide behind our eyes and deep in our conciousness"
        })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic).to.be.an("object");
          expect(topic).to.eql({
            slug: "Outer Sapce, Inner Space",
            description:
              "The endless void that stretches out far and wide behind our eyes and deep in our conciousness"
          });
        });
    });
  });
  describe("/users - POST", () => {
    it("POST:201 - Posts a new user", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "SpaceChaser",
          name: "Neil Armstrong",
          avatar_url: "thisismysuperamazingspacerelatedavatar.com"
        })
        .expect(201)
        .then(({ body: { user } }) => {
          expect(user).to.be.an("object");
          expect(user).to.eql({
            username: "SpaceChaser",
            name: "Neil Armstrong",
            avatar_url: "thisismysuperamazingspacerelatedavatar.com"
          });
        });
    });
  });
  describe("/users - GET", () => {
    it("GET:200 - Returns an array of all the users in the database", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).to.be.an("array");
          users.forEach(user => {
            expect(user).to.have.keys(["username", "name", "avatar_url"]);
          });
        });
    });
  });
});

// {
//   article_id: 1,
//     title: 'Living in the shadow of a great man',
//       body: 'I find this existence challenging',
//         votes: 100,
//           topic: 'mitch',
//             author: 'butter_bridge',
//               created_at: 2018 - 11 - 15T12: 21: 54.171Z
// }

// ERROR HANDLING FOR ALL EXTRA ENDPOINTS
