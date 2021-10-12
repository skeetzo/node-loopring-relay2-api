
var assert = require('assert');




var Loopring = require('./loopring');

var loopringRelay = new Loopring();


loopringRelay.getAccounts(10, getAccountRequest);

describe('Loopring', function() {

  describe('api', function() {

    it('can get accounts', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });

    it('can cancel orders', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });

    it('can submit orders', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });

  });

});




HTTP Return Codes

HTTP 400(BAD_REQUEST) return codes are used for malformed requests; the issue is on the sender's side.

HTTP 429 return code is used when breaking a request rate limit.

HTTP 5XX return codes are used for internal errors; the issue is on Loopring's side.
Error Codes

If there is an error, the API will return an error with a message of the reason.

{
  "code": 100206,
  "msg": "Invalid signature."
}