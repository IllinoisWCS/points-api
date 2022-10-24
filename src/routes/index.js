const router = require("express").Router();

router.use("/events", require("./events"));
router.use("/users", require("./users"));

router.use((_req, res) => {
  res.sendStatus(404);
});

module.exports = router;
