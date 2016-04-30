'use strict';

const expect      = require('code').expect;
const P           = require('bluebird');
const sinon       = require('sinon');
const status      = require('../../../src/services/status');


describe('Status', function () {
  describe('healthCheck', function () {
    beforeEach(function () {
      sinon.stub(status._helpers, 'getAsync');
    });
    afterEach(function () {
      status._helpers.getAsync.restore();
    });
    it('should return status code if success', function () {
      status._helpers.getAsync.returns(P.resolve({statusCode: 200}));
      return status.healthCheck('www.google.com')
        .then(function (res) {
          expect(status._helpers.getAsync.args[0][0].url).to.equal('www.google.com/alive');
          expect(res.statusCode).to.equal(200);
        });
    });
    it('should return status code if fail', function () {
      status._helpers.getAsync.returns(P.reject({statusCode: 500}));
      return status.healthCheck('www.google.com')
          .then(function (res) {
              expect(res.statusCode).to.equal(500);
          });
    });
  })
});
