'use strict';

const joi     = require('joi');
const auth    = require('./services/auth');
const status  = require('./services/status');


const schema = joi.object().keys({
  clientId: joi.string().alphanum().required(),
  clientSecret: joi.string().alphanum().required(),
  lookerBaseUrl: joi.string().required()
});

class Looker {
  constructor(config) {
    joi.validate(config, schema, function (err, value) {
      if (err) {
        throw new Error(err);
      }
    });

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.lookerBaseUrl = config.lookerBaseUrl;

    // stubs for testing
    this._status = status;
    this._auth = auth;
  }
  
  isTokenValid() {
    return !!(this.accessToken && this.tokenExpiration) && (this.tokenExpiration < new Date());
  }

  login() {
    return this._status.healthCheck(this.lookerBaseUrl)
      .then( () => {
        if (this.isTokenValid()) {
          return;
        }
        return this._auth.login(this.lookerBaseUrl, this.clientId, this.clientSecret)
          .then( (res) => {
          this.accessToken = res.access_token;
          this.tokenExpiration = res.expires_at;
        });
      });
  }
}

module.exports = Looker;