const { fetchTopics, createTopic } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  // console.log(req.body);
  const { slug, description } = req.body;
  createTopic(slug, description).then(topic => {
    res.status(201).send({ topic });
  });
};
