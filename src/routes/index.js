const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const isOfficer = require("../middlewares/isOfficer");

router.use(/\/auth/, require("./auth"));
router.use("/events", require("./events"));
router.use("/profile", isAuthenticated, require("./profile"));
router.use("/users", isAuthenticated, isOfficer, require("./users"));

router.use((_req, res) => {
  res.sendStatus(404);
});

module.exports = router;
