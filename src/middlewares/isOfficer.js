module.exports = function (req, res, next) {
  if (req.user.role !== "officer") {
    return res.sendStatus(403);
  }
  next();
};
