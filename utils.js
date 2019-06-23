const secrets = require('./config/secrets');

const generateEventKey = () => {
    i = Math.floor(Math.random() * 10);
    j = Math.floor(Math.random() * 10);
    return secrets.first_word[i] + ' ' + secrets.second_word[j];
}

const validateNetid = netid => {
    const re = new RegExp('\\b[a-z]+\\d{1,3}\\b');
    return re.test(netid);
}

const getTime = timeString => {
    // i.e. 5:30 PM
    timeString = timeString.replace(/\s+/g, '').toLowerCase()
    const timeArr = timeString.split(':')
    // [5, 30pm]
    if (timeString.includes('pm')) {
        timeArr[0] = parseInt(timeArr[0]) + 12
        // [17, 30pm]
    }
    const hours = parseInt(timeArr[0])
    const minutes = timeString.includes(':') ? parseInt(timeArr[1].substring(0, 2)) : 0
    console.log([hours, minutes])
    return [hours, minutes]
}

const validateTime = event => {
    const curDate = new Date()
    const curDay = curDate.getDay()
    const eventDay = event.date.getDay()
    // if before or after event date
    if (curDay < eventDay || curDay > eventDay) {
        console.log([curDay, eventDay])
        return false
    }
    // if before or after event hour
    const startTime = getTime(event.startTime)
    const endTime = getTime(event.endTime)
    const curHour = curDate.getHours()
    // 1 hr buffer after event
    if (curHour < startTime[0] || curHour > endTime[0]) {
        console.log([curHour, startTime[0], endTime[0]])
        return false
    }
    return true
}

const validatePassword = password => {
    return password === secrets.pw 
}

module.exports = {
    generateEventKey,
    validateNetid,
    getTime,
    validateTime,
    validatePassword,
}