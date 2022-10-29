const router = require("express").Router();
const { customAlphabet } = require("nanoid");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isOfficer = require("../middlewares/isOfficer");
const Event = require("../models/event");

const nanoid = customAlphabet("123456789abcdefghijkmnopqrstuvwxyz", 6);

router.get("/", async (req, res, next) => {
  let query = {};
  let projection = ["-__v"];

  if (!req.user || req.user.role !== "officer") {
    query = { private: false };
    projection.push("-key");
  }

  Event.find(query, projection)
    .sort({ start: -1 })
    .exec(function (err, result) {
      if (err) return next(err);
      res.status(200).send(result);
    });
});

router.post("/", isAuthenticated, isOfficer, async (req, res, next) => {
  const eventKey = nanoid();

  const event = new Event({
    ...req.body,
    key: eventKey,
  });

  const err = event.validateSync();
  if (err) return next(err);

  event.save(function (err) {
    if (err) return next(err);
    res.status(200).send({
      message: "Event created successfully",
      key: eventKey,
    });
  });
});

router.delete("/:id", isAuthenticated, isOfficer, async (req, res, next) => {
  Event.findOneAndDelete({ _id: req.params.id }, function (err, result) {
    if (err) return next(err);

    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

router.patch("/:id", isAuthenticated, isOfficer, async (req, res, next) => {
  Event.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    function (err, result) {
      if (err) return next(err);

      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

module.exports = router;
