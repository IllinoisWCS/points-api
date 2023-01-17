const User = require("../models/user");

module.exports = async function (req, res, next) {
  const user = await User.findById(req.user._id);
  if (!user.isOfficer) {
    return res.sendStatus(403);
  }
  next();
};
