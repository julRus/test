exports.errorHandlerPsql = (err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: tweakErrMsg(err) });
  }
  next(err);
};

exports.errorHandlerCustom = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

const tweakErrMsg = err => {
  return err.message.split(" - ")[1];
};

// PATCH ARTICLE - 400:BAD REQ
// PATCH ARTICLE - 404:NOT FOUND
// ARTICLE - 500:INTERNAL SERVER ERROR
