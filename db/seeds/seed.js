const { topicData, articleData, commentData, userData } = require("../data");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  // console.log(topicData);
  // console.log(articleData);
  // console.log(commentData);
  // console.log(userData);
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const userInsertion = knex("users")
        .insert(userData)
        .returning("*");
      const topicInsertion = knex("topics")
        .insert(topicData)
        .returning("*");
      return Promise.all([userInsertion, topicInsertion])
        .then(([userTable, topicTable]) => {
          // console.log(articleData);
          const articleRows = formatDates(articleData);
          return articleRows;
          // console.log(formattedDates);
        })
        .then(articleRows => {
          return knex("articles")
            .insert(articleRows)
            .returning("*")
            .then(articlesTable => {
              // console.log(articlesTable);
              const ref = makeRefObj(articlesTable);
              const formattedComments = formatComments(ref, commentData);
              // console.log(articleRows);
              // console.log(typeof formattedComments[0].article_id);
              return formattedComments;
            })
            .then(formattedComments => {
              return knex("comments")
                .insert(formattedComments)
                .returning("*")
                .then(commentTable => {
                  // console.log(commentTable);
                });
            });
        });
    });
};

// const topicsInsertions = knex("topics").insert(topicData);
// const usersInsertions = knex("users")
//   .insert(userData)
//   .returning("*");
// return Promise.all([usersInsertions]).then(userTable => {
//   /*
//     Your article data is currently in the incorrect format and will violate your SQL schema.
//     You will need to write and test the provided formatDate utility function to be able insert your article data.
//     Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
//     */
//   console.table(userTable);
// });
//     .then(articleRows => {
//       /*
//     Your comment data is currently in the incorrect format and will violate your SQL schema.
//     Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id.
//     You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
//     */
//       const articleRef = makeRefObj(articleRows);
//       const formattedComments = formatComments(commentData, articleRef);
//       return knex("comments").insert(formattedComments);
//     });
// };
