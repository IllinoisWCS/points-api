const { User } = require('../models')
const utils = require('../utils')

module.exports = function(router) {
    const usersRoute = router.route('/users')
    const netIdRoute = router.route('/users/:net_id')

    // get all users
    usersRoute.get(async(req, res) => {
        const users = await User.find({})
        res.json({
            code: 200,
            result: users,
            success: true,
        })
    })

    // get one user
    netIdRoute.get(async(req, res) => {
        const netId = req.params.net_id
        const user = await User.findOne({ netId })
        res.json({
            code: 200,
            result: user,
            success: true,
        })
    })

    // create new user
    usersRoute.post(async(req, res) => {
        const data = req.body
        const netId = data.netId

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
    })

    // update user committee, oh, gwc
    netIdRoute.put(async(req, res) => {
        const data = req.body
        const netId = req.params.net_id
        const user = await User.findOne({ netId })
        let message = 'Already Signed In'

        if (!user) {
            const newUser = new User({ netId });
            await newUser.save()
            user = newUser
        }

        if (data.type === 'committee') {
            if (!user.committees.includes(data.date)) {
                user.committees.push(data.date)
                user.points += 0.5
                message = 'Successfully Added Committee'
            }
        } else if (data.type === 'officeHours') {
            if (!user.officeHours.includes(data.date)) {
                user.officeHours.push(data.date)
                user.points += 0.5
                message = 'Successfully Added Office Hour'
            }
        } else if (data.type === 'girlsWhoCode') {
            if (!user.girlsWhoCode.includes(data.date)) {
                user.girlsWhoCode.push(data.date)
                user.points += 0.5
                message = 'Successfully Added Girls Who Code'
            }
        } else if (data.type === 'attendedEvents') { // TODO: UPDATED CHECK!!
            if (!user.attendedEvents.includes(data.date)) {
                user.attendedEvents.push(data.date)
                user.points += 0.5
                message = 'Successfully Added Attended Event'
            }
        }

        await user.save()
        res.json({
            code: 200,
            message,
            success: true,
        })
    })

    // delete user
    netIdRoute.delete(async(req, res) => {
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
    })

    // delete all users
    usersRoute.delete(async(req, res) => {
        await User.deleteMany({})
        res.json({
            code: 200,
            message: 'Users Deleted Successfully',
            success: true,
        })
    })

    return router
}