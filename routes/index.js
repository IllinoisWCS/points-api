/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router))
    app.use('/api', require('./events.js')(router))
    app.use('/api', require('./users.js')(router))
}
