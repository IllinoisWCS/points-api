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
            console.log("Inside User get: ", req.params)
            const user = await User.findOne({
                netId: netid
            })
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
            console.log("inside user put", data)
            const netid = req.params.net_id
            const user = await User.findOne({ netId: netid })
            let message = 'Checked in!'
                // console.log(data)
                // console.log(netId)
            if (!user) {
                user = new User({ netId: netid });

                // user = newUser
            }
            if (data.key) {

                const event = await Event.findOne({ key: data.key })
                conso
                if (!user.attendedEvents.includes(data.key)) {
                    user.points += event.points
                    user.attendedEvents.push(data.key)
                    console.log("inserted new event: ", user.points)

                }
            }
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