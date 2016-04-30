'use strict';

const expect      = require('code').expect;
const P           = require('bluebird');
const sinon       = require('sinon');
const auth        = require('../../../src/services/auth');

describe('Auth', function () {
  describe('Login', function () {
    beforeEach(function () {
      sinon.stub(auth._helpers, 'requestAsync');
    });
    afterEach(function () {
      auth._helpers.requestAsync.restore();
    });
    it('should return an access token and expiration date', function () {
      auth._helpers.requestAsync.returns(P.resolve({body: {access_token: 'yes', expires_in: 3600}}));
      return auth.login('www.google.com', 'thisIsAClientId', 'thisIsAClientSecret')
        .then(function (res) {
          expect(auth._helpers.requestAsync.args[0][0].url).to.equal('www.google.com/login');
          expect(auth._helpers.requestAsync.args[0][0].method).to.equal('POST');
          expect(auth._helpers.requestAsync.args[0][0].params).to.exist();
          expect(auth._helpers.requestAsync.args[0][0].params.client_id).to.equal('thisIsAClientId');
          expect(auth._helpers.requestAsync.args[0][0].params.client_secret).to.equal('thisIsAClientSecret');
          expect(res.access_token).to.equal('yes');
          expect(res.expires_at).to.be.above(new Date());
        });
    });

    it('should throw if no access token', function () {
      auth._helpers.requestAsync.returns(P.resolve({body: {}}));
      return auth.login('www.google.com', 'thisIsAClientId', 'thisIsAClientSecret')
        .catch(function (res) {
          expect(res).to.match(/Access token not found/);
        });
    });
  });
  describe('logout', function () {
    beforeEach(function () {
      sinon.stub(auth._helpers, 'requestAsync');
    });
    afterEach(function () {
      auth._helpers.requestAsync.restore();
    });
    it('should return a 204', function () {
      auth._helpers.requestAsync.returns(P.resolve({statusCode: 204}));
      return auth.logout('www.google.com', 'thisIsAClientId', 'thisIsAClientSecret')
        .then(function (res) {
          expect(auth._helpers.requestAsync.args[0][0].url).to.equal('www.google.com/logout');
          expect(auth._helpers.requestAsync.args[0][0].method).to.equal('DELETE');
          expect(res.statusCode).to.equal(204);
        });
    });
  });
});
