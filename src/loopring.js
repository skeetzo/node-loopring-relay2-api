'use strict';

const request = require('request');
const url = require('url');



const result = require('dotenv').config()

if (result.error) {
    console.log('Config Not Found');
    process.exit(1);
    return;
}
console.log('Config Loaded; Loading Environment: %s', process.env.NODE_ENV);



class Loopring() {

	let Loopring = this; // eslint-disable-line consistent-this

	constructor() {

		this.apiUrl = process.env.API_PATH;
		this.apiKey = process.env.API_KEY;

	}



	// For GET endpoints, parameters must be sent as a query string.
	// For POST, PUT, and DELETE endpoints, the parameters must be in the request body with content type application/json.
	// All endpoints return either a JSON object or array.
	reqObj = (requestMethod, apiMethod, requestData) => ({
        url: this.apiUrl,
		method: requestMethod,
		json: true,
		headers: {
	    	"content-type": "application/json",
	    	"Accept"       : "application/json",
            "X-API-KEY"    : this.apiKey,
		},
		body : {
			jsonrpc: "2.0",
			id: requestId, 
			method: apiMethod, 
			params: requestData
		}
    })


	// used to verify that the API invocations have been authenticated
	// Algorithm
    // Initialize signatureBase to an empty string.
    // Append the API's HTTP method to signatureBase.
    // Append '＆' to signatureBase.
    // Append percent-encoded full URL path (without ? or any query parameters) to signatureBase.
    // Append '&' to signatureBase.
    // Initialize parameterString to an empty string.
    // For GET / DELETE requests:
    //     Sort query parameters in ascending order lexicographically;
    //     Append percent-encoded key name to parameterString;
    //     Append an '=' to parameterString;
    //     Append percent-encoded value to parameterString;
    //     Append a '&' if there are more key value pairs.
    // For POST / PUT requests:
    //     Append request body as a string to parameterString.
    // Append percent-encoded parameterString to signatureBase
    // Calculate the SHA-256 hash of signatureBase as hash.
    // Signhash with the private EdDSA key and get Rx, Ry, and S.
    // Concatenate Rx,Ry, andS using ',' as: ${Rx},${Ry},${S}.
	commonSignature() {}



	// used by Loopring to verify that off-chain requests have been authenticated
	// Request Type 	eddsaSignature 	ecdsaSignature 	approvedHash 	X-API-SIG
	// submitOrder(AMM swap) 	Y 	N 	N 	N
	// cancelOrder 	N 	N 	N 	Special API Request EDDSA Signatures
	// updateApiKey 	N 	N 	N 	Special API Request EDDSA Signatures
	// joinAmmPool 	Y 	Disabled 	Y 	N
	// exitAmmPool 	Y 	Disabled 	Y 	N
	// submitTransfer 	Y 	Disabled 	Y 	EIP712 signature of request structure
	// submitOffchainWithdraw 	Y 	Disabled 	Y 	EIP712 signature of request structure
	// updateAccount 	Y 	Y 	Y 	EIP712 signature of request structure
	//
    // eddsaSignature, ecdsaSignature, approvedHash are located in REST request body.
    // X-API-SIG is located in REST request header.
    // Y means support.
    // N means not support.
    // Disabled means no longer support.
	offchainSignature(eddsaSignature=false, ecdsaSignature=false, approvedHash=false, X_API_SIG) {}







	getAccounts(requestId, requestData, callback = false) {
		var req = this.reqObj(requestId, 'account', requestData);
		console.log(req);
		return request(req, function(error, response, body) {
		    if (!error) {
		    	console.log(response.statusCode);
		    	console.log(body.result.accountBalance.tokenBalanceMap);
		    } else {
		    	console.error("error: " + error);
		    }
		}); 
	}

	cancelOrders(requestData, callback = false) {
		// this needs to be a DELETE
		var req = this.reqObj(requestId, 'order', requestData);
		console.log(req);
		return request(req, function(error, response, body) {
		    if (!error) {
		    	console.log(response.statusCode);
		    	console.log(body.result.accountBalance.tokenBalanceMap);
		    } else {
		    	console.error("error: " + error);
		    }
		}); 
	}

	submitOrder(requestData, callback = false) {
		var req = this.reqObj(requestId, 'order', requestData);
		console.log(req);
		return request(req, function(error, response, body) {
		    if (!error) {
		    	console.log(response.statusCode);
		    	console.log(body.result.accountBalance.tokenBalanceMap);
		    } else {
		    	console.error("error: " + error);
		    }
		}); 
	}
}



module.exports = Loopring;