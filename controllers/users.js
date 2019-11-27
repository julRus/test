const { fetchUserById, createUser, fetchUsers } = require("../models/users");

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  // console.log(typeof username);
  fetchUserById(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  createUser(username, name, avatar_url).then(user => {
    res.status(201).send({ user });
  });
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then(users => {
    res.status(200).send({ users });
  });
};
