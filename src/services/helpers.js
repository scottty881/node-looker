'use strict';

const P        = require('bluebird');
const request  = require('request');

module.exports = {
  getAsync: P.promisify(request, 'get'),
  requestAsync: P.promisify(request)
};
