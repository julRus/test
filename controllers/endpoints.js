const { fetchEndpoints } = require("../models/endpoints");

exports.getEndpoints = (req, res) => {
  fetchEndpoints((err, endpoints) => {
    res.status(200).json({ endpoints });
  });
};
