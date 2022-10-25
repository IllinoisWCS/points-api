const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

router.use(/\/auth/, require("./auth"));
router.use("/events", isAuthenticated, require("./events"));
router.use("/user", isAuthenticated, require("./user"));

router.use((_req, res) => {
  res.sendStatus(404);
});

module.exports = router;
