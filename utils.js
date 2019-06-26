const secrets = require('./config/secrets');
const moment = require('moment')
const twix = require('twix')

const generateEventKey = () => {
    i = Math.floor(Math.random() * 10);
    j = Math.floor(Math.random() * 10);
    return secrets.first_word[i] + ' ' + secrets.second_word[j];
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

const validatePassword = password => {
    return password === secrets.pw 
}

module.exports = {
    generateEventKey,
    validateNetid,
    validateTime,
    validatePassword,
}