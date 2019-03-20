const moment = require('moment.js');
function timestampToString(timestamp) {
  moment.locale('en', {
    longDateFormat: {
      l: "YYYY-MM-DD",
      L: "YYYY-MM-DD HH:mm:ss"
    }
  });
  return moment(timestamp).format('L');
}

module.exports = {
  timestampToString: timestampToString
} 
