'use strict';

const moment     = require('moment');
const helpers    = require('./helpers');
const constants  = require('../constants');

module.exports = {
  _helpers: helpers,
  login: function(lookerUrlBase, clientId, clientSecret) {
    return this._helpers.requestAsync({
      url: lookerUrlBase + constants.LOOKER_URLS.LOGIN,
      method: 'POST',
      params: {
        client_id: clientId,
        client_secret: clientSecret
      }
    })
      .then(function (res) {
        if (res && res.body && res.body.access_token) {
          return {
            access_token: res.body.access_token,
            expires_at: moment().add(res.body.expires_in).toDate()
          };
        }
        throw new Error('Access token not found');
      });
  },
  logout: function(lookerUrlBase) {
    return this._helpers.requestAsync({
        url: lookerUrlBase + constants.LOOKER_URLS.LOGOUT,
        method: 'DELETE'
      });
  }
};
