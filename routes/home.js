var secrets = require('../config/secrets');

var Event = require('../models/event');
var User = require('../models/user');

module.exports = function (router) {

  var homeRoute = router.route('/');

  homeRoute.get(function (req, res) {
    var connectionString = secrets.token;
    res.json({ message: 'My connection string is ' + connectionString });
  });

  var eventsRoute = router.route('/events');

  eventsRoute.get(function (req, res) {
    var query = Event.find({});

    query.exec(function (err, events) {
      if (err) return res.status(500);
      res.json({ message: 'OK', data: events });
    })
  });

  eventsRoute.post(function (req, res) {
    var errMsg = '';

    if (!req.body.name) {
      errMsg += 'An event name is required! ';
    }

    if (!req.body.points) {
      errMsg += 'A point value for the event is required! ';
    }

    if (!req.body.date) {
      errMsg += 'A date for the event is required! '
    }

    if (errMsg) {
      errMsg = 'Validation error(s): ' + errMsg;
      console.log(errMsg);
      return res.status(500).json({ message: errMsg, data: [] });
    }

    console.log(req.body);

    var newEvent = new Event({
      name: req.body.name,
      date: req.body.date,
      points: req.body.points
    });

    newEvent.save(function (err) {
      if (err) return res.status(500).json({ message: 'Error with creating the event', data: [] });
      res.status(201).json({ message: 'Event created!', data: newEvent });
    });
  })

  var eventIdRoute = router.route('/events/:id');

  eventIdRoute.get(function (req, res) {
    Event.findOne({ _id: req.params.id }, function (err, event) {
      if (err || !event) return res.status(404).json({ message: 'Event not found', data: [] });
      res.json({ message: 'OK', data: event });
    })
  });

  eventIdRoute.put(function (req, res) {
    const netid = req.body.netid;

    Event.findOne({ _id: req.params.id }, function (err, event) {
      if (err || !event) return res.status(404).json({ message: 'Event not found', data: [] });
      event.attendees.push(netid);
      event.save(function (err) {
        if (err) return res.status(500).json({ message: 'Error with updating the event', data: [] });
        res.status(201).json({ message: 'Event updated!', data: event });
      });
    })

  })

  var userRoute = router.route('/users/:id');

  userRoute.put(function (req, res) {
    var type = req.body.type;
    var date = req.body.date;
    var netid = req.params.id;

    var targetUser;

    User.findOne({
      netid: req.params.id
    }, function(err, user) {

      if (err) {
        return res.status(500);
      }

      if (!user) {
        // Create a user if they don't exist
        var newUser = new User({
          netid: req.params.id,
          office_hours: [],
          committees: []
        });

        newUser.save(function (err) {
          if (err) return res.status(500).json({ message: 'Error with creating the user', data: [] });
        });

        targetUser = newUser;
      } else {
        targetUser = user;
      }
      // Update userstats w/ committee & oh pts

      if (type === 'committee') {
        targetUser.committees.push(date)
      } else if (type === 'office_hours'){
        targetUser.office_hours.push(date);
      }

      targetUser.save(function (err) {
        if (err) return res.status(500).json({ message: 'Error with updating the user', data: [] });
        res.json({ message: 'OK', data: targetUser });
      })
    });
  });

  userRoute.get(function (req, res) {

    var userStats = {
      'attended_events': [],
      'committees': [],
      'office_hours': []
    };

    var targetUser;

    User.findOne({
      netid: req.params.id
    }, function(err, user) {

      if (err) {
        return res.status(500);
      }

      if (!user) {
        // Create a user if they don't exist
        var newUser = new User({
          netid: req.params.id,
          office_hours: [],
          committees: []
        });

        newUser.save(function (err) {
          if (err) return res.status(500).json({ message: 'Error with creating the user', data: [] });
        });

        targetUser = newUser;
      } else {
        targetUser = user;
      }

      // Update userstats w/ committee & oh pts
      userStats.committees = targetUser.committees;
      userStats.office_hours = targetUser.office_hours;
    });

    // Totals up points for User
    var query = Event.find({});
    query.exec(function (err, events) {
      if (err) return res.status(500);

      events.forEach(function (event) {
        if(event.attendees.includes(req.params.id)) {
          userStats.attended_events.push(event);
        }
      })

      // res.json({ message: 'Total number of points for ' + req.params.id + ': ' + total_pts, data: attended_events })
      res.json({ message: 'OK', data: userStats });
    })
  });

  return router;
}
