const request = require('request');

const fetchMyIP = (cb) => {
  request('https://api.ipify.org?format=json',(error, response, body) => {
    if (error) {
      return (error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return (Error(msg), null);
    }
    const ip = JSON.parse(body).ip;
    cb(null,ip);
  });
};
module.exports = {fetchMyIP,};