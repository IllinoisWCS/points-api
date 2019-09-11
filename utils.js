const secrets = require('./config/secrets');
const moment = require('moment')
const twix = require('twix')

const generateEventKey = () => {

    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

const validateNetid = netid => {
    const re = new RegExp('\\b[a-z]+\\d{1,3}\\b');
    return re.test(netid);
}

const validateTime = (event) => {
    // checking if correct day
    const curDate = moment().format('YYYY-MM-DD')
    const eventDate = moment(event.date).format('YYYY-MM-DD')
    if (curDate !== eventDate) {
        return false
    }

    // checking if w/in time range
    const range = moment(`${eventDate} ${event.startTime}`).twix(`${eventDate} ${event.endTime}`);
    return range.isCurrent()
}

const validateUser = netid => {

    return secrets.officers.includes(netid)
}

module.exports = {
    generateEventKey,
    validateNetid,
    validateTime,
    validateUser,
}