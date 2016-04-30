'use strict';

const helpers    = require('./helpers');
const constants  = require('../constants');

module.exports = {
  _helpers: helpers,
  healthCheck: function(lookerUrlBase) {
    return this._helpers.getAsync({url: lookerUrlBase + constants.LOOKER_URLS.HEALTH_CHECK})
        .then(function (res) {
            return {statusCode: res.statusCode};
        })
        .catch(function (err) {
            return {statusCode: err.statusCode};
        });
  }
};
