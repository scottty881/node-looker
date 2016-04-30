'use strict';

const expect = require('code').expect;
const moment = require('moment');
const P      = require('bluebird');
const sinon  = require('sinon');
const Looker = require('../../src/looker');

describe('Looker', function () {
  it('should validate contructor args', function () {
    const fail = function () {
      new Looker({});
    };
    expect(fail).to.throw('ValidationError', /required/);
  });
  it('should instantiate with lookerurl, clientid and clientsecret', function () {
    const testUrl = 'https://www.test.com';
    const looker = new Looker({
      lookerBaseUrl: 'https://www.test.com',
      clientId: 'yes1',
      clientSecret: 'no9'
    });
    expect(looker).to.exist();
    expect(looker.lookerBaseUrl).to.equal(testUrl);
    expect(looker.clientId).to.equal('yes1');
    expect(looker.clientSecret).to.equal('no9');
  });

  describe('isTokenValid', function () {
    let looker;
    beforeEach(function () {
      looker = new Looker({
        lookerBaseUrl: 'https://www.test.com',
        clientId: 'yes1',
        clientSecret: 'no9'
      });
    });

    it('should return false if no access token', function () {
      expect(looker.isTokenValid()).to.equal(false);
    });

    it('should return false if token expired', function () {
      looker.accessToken = 'test';
      looker.tokenExpiration =  moment().add(100, 'ms').toDate();
      expect(looker.isTokenValid()).to.equal(false);
    });

    it('should return true if token is valid', function () {
      looker.accessToken = 'test';
      looker.tokenExpiration =  moment().subtract(1000, 'ms').toDate();
      expect(looker.isTokenValid()).to.equal(true);
    });
  });

  describe('login', function () {
    let looker;
    beforeEach(function () {
      looker = new Looker({
        lookerBaseUrl: 'https://www.test.com',
        clientId: 'yes1',
        clientSecret: 'no9'
      });
      sinon.stub(looker._status, 'healthCheck').returns(P.resolve());
      sinon.stub(looker._auth, 'login').returns(P.resolve({access_token: 'yes', expires_at: new Date()}));
    });
    afterEach(function () {
      looker._status.healthCheck.restore();
      looker._auth.login.restore();
    });
    it('should call healthcheck then login', function () {
      return looker.login()
        .then( () => {
          expect(looker.accessToken).to.equal('yes');
          expect(looker.tokenExpiration).to.exist();
          expect(looker._status.healthCheck.calledOnce).to.equal(true);
          expect(looker._auth.login.calledOnce).to.equal(true);
      });
    });
    it('if access token is valid return true', function () {
      looker.accessToken = 'test';
      looker.tokenExpiration =  moment().subtract(1000, 'ms').toDate();
      return looker.login()
          .then( () => {
          expect(looker._status.healthCheck.calledOnce).to.equal(true);
          expect(looker._auth.login.calledOnce).to.equal(false);
        });
    });
  });
});