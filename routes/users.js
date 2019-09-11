const { User } = require('../models')
const { Event } = require('../models')
const utils = require('../utils')

module.exports = function(router) {
    const usersRoute = router.route('/users')
    const netIdRoute = router.route('/users/:net_id')

    // get all users
    usersRoute.get(async(req, res) => {
        try {
            const users = await User.find({})
            res.json({
                code: 200,
                result: users,
                success: true,
            })

        } catch (err) {
            console.log(err)
        }

    })

    // get one user
    netIdRoute.get(async(req, res) => {
        try {
            const netid = req.params.net_id
                // console.log("Inside User: " + req.params)
            const user = await User.findOne({
                    netId: netid
                })
                // console.log("user found: " + user)
            res.json({
                code: 200,
                result: user,
                success: true,
            })

        } catch (err) {
            console.log(err)
        }

    })

    // create new user
    usersRoute.post(async(req, res) => {
        try {
            const data = req.body
            const netId = data.netId
                // console.log(data);

            if (!netId) {
                res.json({
                    code: 404,
                    message: 'NetId is Required',
                    success: false,
                })
            } else if (!utils.validateNetid(netId)) {
                res.json({
                    code: 404,
                    message: 'Invalid NetId',
                    success: false,
                })
            } else {
                let user = await User.findOne({ netId })
                if (!user) {
                    const newUser = new User({ netId });
                    await newUser.save()
                    res.json({
                        code: 200,
                        message: 'User Successfully Created',
                        success: true,
                    })
                } else {
                    res.json({
                        code: 404,
                        message: 'User Already Exists',
                        success: false,
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }

    })

    // update user committee, oh, gwc
    netIdRoute.put(async(req, res) => {
        try {
            const data = req.body
            const netId = req.params.net_id
            const user = await User.findOne({ netId })
            let message = 'Checked in!'
                // console.log(data)
                // console.log(netId)

            if (!user) {
                const newUser = new User({ netId });
                await newUser.save()
                user = newUser
            }
            if (data.key) {
                const event = await Event.findOne({ key: data.key })
                if (user.attendedEvents.length > 0 && user.attendedEvents.indexOf(data.key) <= -1) {
                    user.points += event.points
                    user.attendedEvents.push(data.key)

                }
            }

            // if (data.type === 'committee') {
            //     if (!user.committees.includes(data.date)) {
            //         user.committees.push(data.date)
            //         user.points += 0.5
            //         message = 'Successfully Added Committee'
            //     }
            // } else if (data.type === 'officeHours') {
            //     if (!user.officeHours.includes(data.date)) {
            //         user.officeHours.push(data.date)
            //         user.points += 0.5
            //         message = 'Successfully Added Office Hour'
            //     }
            // } else if (data.type === 'girlsWhoCode') {
            //     if (!user.girlsWhoCode.includes(data.date)) {
            //         user.girlsWhoCode.push(data.date)
            //         user.points += 0.5
            //         message = 'Successfully Added Girls Who Code'
            //     }
            // } else if (data.type === 'attendedEvents') { // TODO: UPDATED CHECK!!
            //     if (!user.attendedEvents.includes(data.date)) {
            //         user.attendedEvents.push(data.date)
            //         user.points += 0.5
            //         message = 'Successfully Added Attended Event'
            //     }
            // }

            await user.save()
            res.json({
                code: 200,
                message: message,
                result: user.attendedEvents,
                success: true,
            })

        } catch (err) {
            console.log(err)
        }

    })

    // delete user
    netIdRoute.delete(async(req, res) => {
        try {
            const netId = req.params.net_id
            const user = await User.findOneAndRemove({ netId })

            const ret = user ? {
                code: 200,
                message: 'User Deleted Successfully',
                success: true,
            } : {
                code: 404,
                message: 'User Not Found',
                success: false,
            }

            res.json(ret)

        } catch (err) {
            console.log(err)
        }

    })

    // delete all users
    usersRoute.delete(async(req, res) => {
        try {
            await User.deleteMany({})
            res.json({
                code: 200,
                message: 'Users Deleted Successfully',
                success: true,
            })

        } catch (err) {
            console.log(err)
        }

    })

    return router
}