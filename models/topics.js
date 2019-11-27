const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

exports.createTopic = (headline, desc) => {
  // console.log(slug, desc);
  return connection("topics")
    .insert({
      slug: headline,
      description: desc
    })
    .returning("*")
    .then(topics => {
      return topics[0];
    });
};
