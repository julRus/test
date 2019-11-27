const { updateComment, removeComment } = require("../models/comments");

exports.patchComment = (req, res, next) => {
  const { comments_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comments_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comments_id } = req.params;
  removeComment(comments_id)
    .then(comment => {
      res.sendStatus(204);
    })
    .catch(next);
};
