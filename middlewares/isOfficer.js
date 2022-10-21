module.exports = function (req, res, next) {
  const officers = JSON.parse(process.env.OFFICERS);
  if (!officers.includes(req.body.password)) {
    return res.sendStatus(403);
  }
  next();
};
