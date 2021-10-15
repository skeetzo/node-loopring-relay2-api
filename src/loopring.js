
const result = require('dotenv').config()

if (result.error)
    console.error('Environment Config Not Found');
else
	console.log('Config Loaded; Loading Environment: %s', process.env.NODE_ENV);

const API_PATH 	= 	process.env.API_PATH;
var   API_URL 	= 	process.env.API_TESTNET;

if (process.env.NODE_ENV == "production")
	API_URL = process.env.API_MAINNET;

const path = require('path'),
	  request = require('request'),
	  url = require('url');

// integrated node-rest-client-VS for handling requests to loopring API
const Client = require('node-rest-client').Client;

const Util = require('./util'),
	  METHODS = Util.METHODS,
	  web3Validator =	Util.web3Validator,
	  txValidator   =	Util.txValidator,
	  poolValidator =	Util.poolValidator,
	  tokenValidator =	Util.tokenValidator,
	  tradeValidator =	Util.tradeValidator,
	  blockValidator =	Util.blockValidator;

////////////////////////////////////////////////////////////////////////////////////////////////////

class Loopring() {

	constructor(apiKey) {

		this.apiKey = apiKey;

		this.client = new Client();

		// register all methods for ease of access
		for (const [_method, _api, _type] in METHODS)
			this.client.registerMethod(_method, path.resolve(API_URL, API_PATH, _api), _type.toUppercase());

		//add default validater managers for blockchain data
		this.client.validators.add(web3Validator);
		this.client.validators.add(txValidator);
		this.client.validators.add(poolValidator);
		this.client.validators.add(tokenValidator);
		this.client.validators.add(tradeValidator);
		this.client.validators.add(blockValidator);

	}






	overwrite node-rest-client-VS signing behavior

	submitOrder requires eddsaSignature
	updateApiKey and cancelOrder require the specialSignature
	join and exit AMM require eddsaSignature, approvedHash
	submitTransfer and submitOffchainWithdraw require EIP712 signature of request structure and also eddsaSignature, approvedHash 
	updateAccount requires everything and EIP712 signature



	so everything should be signed by specialSignature unless forced to skip or something
	the last 3 require the offchainSignature

	// Special API Request Signatures
	// Algorithm
    Initialize signatureBase to an empty string.
    Append the API's HTTP method to signatureBase.
    Append '＆' to signatureBase.
    Append percent-encoded full URL path (without ? or any query parameters) to signatureBase.
    Append '&' to signatureBase.
    Initialize parameterString to an empty string.
    For GET / DELETE requests:
        Sort query parameters in ascending order lexicographically;
        Append percent-encoded key name to parameterString;
        Append an '=' to parameterString;
        Append percent-encoded value to parameterString;
        Append a '&' if there are more key value pairs.
    For POST / PUT requests:
        Append request body as a string to parameterString.
    Append percent-encoded parameterString to signatureBase
    Calculate the SHA-256 hash of signatureBase as hash.
    Signhash with the private EdDSA key and get Rx, Ry, and S.
    Concatenate Rx,Ry, andS using ',' as: ${Rx},${Ry},${S}.

	specialSignature() {



		class EddsaSignHelper() {

		    constructor(poseidon_params, private_key) {
		        this.poseidon_sign_param = poseidon_params
		        this.private_key = private_key
		        // console.log("this.private_key = {this.private_key}")
		    }

		    function hash(structure_data) {
		        serialized_data = this.serialize_data(structure_data)
		        msgHash = poseidon(serialized_data, this.poseidon_sign_param)
		        return msgHash
		    }

		    function sign(structure_data) {
		        msgHash = this.hash(structure_data)
		        signedMessage = PoseidonEdDSA.sign(msgHash, FQ(int(this.private_key, 16)))
		        return "0x" + "".join([
		                        hex(int(signedMessage.sig.R.x))[2:].zfill(64),
		                        hex(int(signedMessage.sig.R.y))[2:].zfill(64),
		                        hex(int(signedMessage.sig.s))[2:].zfill(64)
		                    ])
		    }
		}

		class OrderEddsaSignHelper extends EddsaSignHelper():
		    constructor(private_key):
		        super(OrderEddsaSignHelper, this).__init__(
		            poseidon_params(SNARK_SCALAR_FIELD, 12, 6, 53, b'poseidon', 5, security_target=128),
		            private_key
		        )

		    function serialize_data(order):
		        return [
		            int(order["exchange"], 16),
		            int(order["storageId"]),
		            int(order["accountId"]),
		            int(order["sellToken"]['tokenId']),
		            int(order["buyToken"]['tokenId']),
		            int(order["sellToken"]['volume']),
		            int(order["buyToken"]['volume']),
		            int(order["validUntil"]),
		            int(order["maxFeeBips"]),
		            int(order["fillAmountBOrS"]),
		            int(order.get("taker", "0x0"), 16)
		        ]













headers = {
            "Content-Type" : "application/json",
            "Accept"       : "application/json",
            "X-API-KEY"    : self.api_key,
        }




	}

	// used by Loopring to verify that off-chain requests have been authenticated
	// Request Type 		eddsaSignature 		ecdsaSignature 		approvedHash 		X-API-SIG
	// submitOrder(AMM swap) 	Y 					N 					N 					N
	// cancelOrder 				N 					N 					N 		Special API Request EDDSA Signatures
	// updateApiKey 			N 					N 					N 		Special API Request EDDSA Signatures
	// joinAmmPool 				Y 					Disabled 			Y 					N
	// exitAmmPool 				Y 					Disabled 			Y 					N
	// submitTransfer 			Y 					Disabled 			Y 		EIP712 signature of request structure
	// submitOffchainWithdraw 	Y 					Disabled 			Y 		EIP712 signature of request structure
	// updateAccount 			Y 					Y 					Y 		EIP712 signature of request structure
	//
    // eddsaSignature, ecdsaSignature, approvedHash are located in REST request body.
    // X-API-SIG is located in REST request header.
    // Y means support.
    // N means not support.
    // Disabled means no longer support.
	offchainSignature(eddsaSignature=false, ecdsaSignature=false, approvedHash=false, X_API_SIG) {}


	/*
		method

		Calls the appropriate Loopring API method

		@param apiPath string The path of the Loopring API method to call
		@param parameters object Query parameters to use
		@param data object REST API parameters to send
	*/
	async method(apiPath, parameters={}, data={}) => {

		var method, requestType, validator;

		for (const [_method, _apiPath, _requestType, _validator] in METHODS)
			if (_apiPath === apiPath) {
				method = _method;
				requestType = _requestType;
				validator = _validator;
			}

		const args = {
			// data passed to REST method (only useful in POST, PUT or PATCH methods)
			data: (type in ["POST","PUT","PATCH"]) ? { ...data } : {},

			// You can pass diferents args to registered methods, 
			// simplifying reuse: path replace parameters, query parameters, custom headers
			// path: { "id": 120 }, // path substitution var
			parameters: { ...parameters }, // this is serialized as URL parameters

			// POST, PUT or PATCH method invocation are configured like GET calls 
			// with the difference that you have to set "Content-Type" header in 
			// args passed to client method invocation: If no "Content-Type" header is 
			// set as client arg POST,PUT and PATCH methods will not work properly.
			headers: { 
				"Content-Type": (type in ["POST","PUT","PATCH"]) ? "application/json" : "",
				"Web3-Type": (validator) ? validator : ""
			},

			requestConfig: {
				timeout: 1000, //request timeout in milliseconds
				noDelay: true, //Enable/disable the Nagle algorithm
				keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
				followRedirects: false //whether redirects should be followed(default,true) 
			},
			responseConfig: {
				timeout: 1000 //response timeout
			}
		};

		const [data, response] = await client.methods[method](args);
		console.log(data);
		console.log(response);
		return data;
	}

}

module.exports = Loopring;
