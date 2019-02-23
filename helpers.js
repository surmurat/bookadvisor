const moment = require('moment');
const axios = require('axios');

module.exports = {
    GetDateDifference: (firstDate, secondDate) => {
        let a = moment(firstDate);
        return a.diff(secondDate, 'hours');
    }
};