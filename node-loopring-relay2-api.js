'use strict';

const request = require('request');
const url = require('url');

function LoopringRelay() {

	let LoopringRelay = this; // eslint-disable-line consistent-this

	// TODO: url待定
	LoopringRelay.apiUrl = "http://13.231.176.170:8080/api/loopring";

	LoopringRelay.reqObj = (requestId, apiMethod, requestData) => ({
        url: this.apiUrl,
		method: "POST",
		json: true,
		headers: {
	    	"content-type": "application/json",
		},
		body : {
			jsonrpc: "2.0",
			id: requestId, 
			method: apiMethod, 
			params: requestData
		}
    })
}


LoopringRelay.prototype.getAccounts = function (requestId, requestData, callback = false) {
	var req = this.reqObj(requestId, 'get_account', requestData);
	console.log(req);
	request(req, function(error, response, body) {
	    if (!error) {
	    	console.log(response.statusCode);
	    	console.log(body.result.accountBalance.tokenBalanceMap);
	    } else {
	    	console.error("error: " + error);
	    }
	}); 
};

LoopringRelay.prototype.cancelOrders = function (requestData, callback = false) {
	var req = this.reqObj(requestId, 'cancel_orders', requestData);
	console.log(req);
	request(req, function(error, response, body) {
	    if (!error) {
	    	console.log(response.statusCode);
	    	console.log(body.result.accountBalance.tokenBalanceMap);
	    } else {
	    	console.error("error: " + error);
	    }
	}); 
};

LoopringRelay.prototype.submitOrder = function (requestData, callback = false) {
	var req = this.reqObj(requestId, 'submit_order', requestData);
	console.log(req);
	request(req, function(error, response, body) {
	    if (!error) {
	    	console.log(response.statusCode);
	    	console.log(body.result.accountBalance.tokenBalanceMap);
	    } else {
	    	console.error("error: " + error);
	    }
	}); 
};



module.exports = LoopringRelay;