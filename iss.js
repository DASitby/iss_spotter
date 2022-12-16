const request = require('request');

const fetchMyIP = (cb) => {
  request('https://api.ipify.org?format=json',(error, response, body) => {
    if (error) {
      return cb(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return cb(Error(msg), null);
    }
    const ip = JSON.parse(body).ip;
    return cb(null,ip);
  });
};

const fetchCoordsByIP = (ip, cb) => {
  request(`https://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return cb(error, null);
    }
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      cb(Error(message), null);
      return;
    }
    const coords = {latitude: parsedBody.latitude, longitude: parsedBody.longitude};
    cb(null, coords);
  });
};

module.exports = {fetchMyIP, fetchCoordsByIP,};