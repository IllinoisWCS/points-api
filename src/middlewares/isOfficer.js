module.exports = function (req, res, next) {
  if (!req.user.isOfficer) {
    return res.sendStatus(403);
  }
  next();
};
