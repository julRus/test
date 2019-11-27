exports.error405 = (req, res, next) => {
  res.status(405).json({ msg: "method not allowed" });
};
