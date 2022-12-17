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
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      cb(error, null);
      return;
    }
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      cb(Error(message), null);
      return;
    }
    const { latitude, longitude } = parsedBody;
    return cb(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = (coords,cb) => {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      return cb(error, null);
    }
    const parsedBody = JSON.parse(body);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return cb(Error(msg), null);
    }
    return cb(null,parsedBody.response);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = {nextISSTimesForMyLocation};