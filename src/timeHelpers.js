const moment = require('moment');

const secondsToTime = (secs) => moment().startOf('day').seconds(secs);

const timeFormat = d3.timeFormat('%I %p');

const toMonthDay = (date) => moment(date).format('MMM  DD');

module.exports = {
  secondsToTime,
  timeFormat,
  toMonthDay,
};
