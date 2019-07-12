const { Event, User } = require('../models')
const utils = require('../utils')

module.exports = function (router) {
    const eventsRoute = router.route('/events');
    const eventIdRoute = router.route('/events/:eventId')
    const eventCheckinRoute = router.route('/events/:eventId/signin')

    // get all events
    eventsRoute.get(async (req, res) => {
        const events = await Event.find({});
        res.json({
            code: 200,
            result: events,
            success: true,
        });
    })

    // get one event
    eventIdRoute.get(async (req, res) => {
        const eventId = req.params.eventId
        const event = await Event.findById(eventId)
        res.json({
            code: 200,
            result: event,
            success: true,
        })
    })

    // create new event
    eventsRoute.post(async (req, res) => {
        const data = req.body
        const eventKey = utils.generateEventKey()
        let errMsg = ''

        if (!data.name) {
            errMsg += 'Name, '
        }
        if (!data.points) {
            errMsg += 'Points, '
        }
        if (!data.category) {
            errMsg += 'Category, '
        }
        if (!data.date) {
            errMsg += 'Date, '
        }
        if (!data.startTime) {
            errMsg += 'Start Time, '
        }
        if (!data.endTime) {
            errMsg += 'End Time, '
        }
        if (!data.password) {
            errMsg += 'Password, '
        }
        if (errMsg) {
            errMsg += 'is required.'
            res.json({
                code: 500,
                message: errMsg,
                success: false,
            })
        } else if (!utils.validatePassword(data.password)) {
            res.json({
                code: 404,
                message: 'Invalid Password',
                success: false,
            })
        } else {
            const newEvent = new Event({
                name: data.name,
                points: data.points,
                category: data.category,
                key: eventKey,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
            });
            await newEvent.save()
            res.json({
                code: 200,
                message: 'Event Successfully Created',
                result: eventKey,
                success: true,
            })
        }
    })

    // update an event
    eventIdRoute.put(async (req, res) => {
        const data = req.body
        const eventId = req.params.eventId
        let fieldsToUpdate = {}

        if (data.name) {
            fieldsToUpdate.name = data.name
        }
        if (data.points) {
            fieldsToUpdate.points = data.points
        }
        if (data.category) {
            fieldsToUpdate.category = data.category
        }
        if (data.date) {
            fieldsToUpdate.date = data.date
        }
        if (data.startTime) {
            fieldsToUpdate.startTime = data.startTime
        }
        if (data.endTime) {
            fieldsToUpdate.endTime = data.endTime
        }

        const event = await Event.findByIdAndUpdate(
            eventId, 
            { $set: fieldsToUpdate }, 
            { new: true },
        )
        
        // return first msg if event exists, else return second
        const ret = event
            ?   {
                    code: 200,
                    message: 'Event Updated Successfully',
                    success: true,
                }
            :   {
                    code: 404,
                    message: 'Event Not Found',
                    success: false,
                }
        
        res.json(ret)
    })

    // check-in to event
    eventCheckinRoute.put(async (req, res) => {
        const data = req.body
        const netId = data.netId
        const key = data.key
        const eventId = req.params.eventId

        // invalid netid
        const isValid = utils.validateNetid(netId)
        const event = await Event.findById(eventId)

        if (!isValid) {
            res.json({
                code: 404,
                message: 'Invalid Netid',
                success: false,
            })
        } else if (!event) {
            res.json({
                code: 404,
                message: 'Invalid Event',
                success: false,
            })
        } else if (key !== event.key) {
            res.json({
                code: 404,
                message: 'Invalid Event Key',
                success: false,
            })
        } else if (!utils.validateTime(event)) {
            res.json({
                code: 404,
                message: 'Event Not Running',
                success: false,
            })
        } else if (event.attendees.includes(netId)) {
            res.json({
                code: 200,
                message: 'Already Signed In',
                success: true,
            })
        } else {
            event.attendees.push(netId)
            await event.save()
            // update user
            let user = await User.findOne({ netId: data.netId })
            if (!user) {
                const newUser = new User({
                    netId,
                })
                user = newUser
            }
            user.points += event.points
            await user.save()
            res.json({
                code: 200,
                message: 'Successfully Checked In',
                success: true,
            })
        }
    })

    // delete one event
    eventIdRoute.delete(async (req, res) => {
        const eventId = req.params.eventId
        const event = await Event.findByIdAndRemove(eventId)

        const ret = event
        ?   {
                code: 200,
                message: 'Event Deleted Successfully',
                success: true,
            }
        :   {
                code: 404,
                message: 'Event Not Found',
                success: false,
            }
        
        res.json(ret)
    })

    // delete all events
    eventsRoute.delete(async (req, res) => {
        await Event.deleteMany({})
        res.json({
            code: 200,
            message: 'Events Deleted Successfully',
            success: true,
        })
    })

    return router
}
