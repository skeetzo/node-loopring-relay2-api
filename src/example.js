var Loopring = require('./loopring');
var ethUtil = require("ethereumjs-util");
var pjs = require("protocol2-js");
var eip712Util = require("./eip712-util");
const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');

var getAccountRequest = {address: "0xe20cf871f1646d8651ee9dc95aab1d93160b3467", tokens: []};
getAccountRequest.tokens.push("0x97241525fe425c90ebe5a41127816dcfa5954b06");

var loopringRelay = new Loopring();

//loopringRelay.getAccounts(10, getAccountRequest);

/*"params": {
    "rawOrder": {
      "owner": "0xb94065482ad64d4c2b9252358d746b39e820a582",
      "version": 0,
      "tokenS": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "tokenB": "0xef68e7c694f40c8202821edf525de3782458639f",
      "amountS": "0xde0b6b3a7640000",
      "validSince": 1548422323,
      "amountB": "0x3635c9adc5dea00000",
      "params": {
        "validUntil": 0,
        "allOrNone": true,
        "broker": "0xbe101a20b24c4dc8f8adacdcb4928d9ae2a39f82",
        "wallet": "0xb94065482ad64d4c2b9252358d746b39e820a582",
        "sig": "0x0141a3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b",
        "dualAuthAddr": "0x7ebdf3751f63a5fc1742ba98ee34392ce82fa8dd",
        "dualAuthPrivateKey": "0xc3d695ee4fcb7f14b8cf08a1d588736264ff0d34d6b9b0893a820fe01d1086a6"
      },
      "feeParams": {
        "tokenFee": "0xef68e7c694f40c8202821edf525de3782458639f",
        "amountFee": "0xde0b6b3a7640000",
        "tokenRecipient": "0xb94065482ad64d4c2b9252358d746b39e820a582",
        "tokenSFeePercentage": 10,
        "tokenBFeePercentage": 0,
        "walletSplitPercentage": 40
      },
      "erc1400Params": {
        tokenStandardS: "ERC20",
        tokenStandardB: "ERC1400",
        tokenStandardFee: "ERC20",
        trancheS: "",
        trancheB: "",
        transferDataS: ""
      }
    }
}*/

var order = {
	version: 1,
	amountS: 15,
	amountB: 20,
	feeAmount: 30,
	validSince: 1553743963,
	validUntil:1553830363,
	owner: "0xb94065482ad64d4c2b9252358d746b39e820a582",
	tokenS: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
	tokenB: "0xef68e7c694f40c8202821edf525de3782458639f",
	tokenRecipient:"0xb94065482ad64d4c2b9252358d746b39e820a582",
	feeToken:"0xef68e7c694f40c8202821edf525de3782458639f",
	walletSplitPercentage:1,
	tokenSFeePercentage:5,
	tokenBFeePercentage:40,
	allOrNone:true
};

var cancelRequest = {
	id:"0x" + "0".repeat(64),
	owner:"0xb94065482ad64d4c2b9252358d746b39e820a582",
	marketPair: {
		baseToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        quoteToken: "0xef68e7c694f40c8202821edf525de3782458639f"
	},
	time: "0x5c4e980e"
}

console.log(order);

let privateKey
do {
	privateKey = randomBytes(32)
} while (!secp256k1.privateKeyVerify(privateKey));

console.log(privateKey);

const publicKey = ethUtil.bufferToHex(ethUtil.privateToAddress(privateKey));
const owner = ethUtil.privateToAddress(privateKey);
console.log(privateKey);
console.log(publicKey);
console.log(owner);

orderUtil = new pjs.OrderUtil();
var orderHash = orderUtil.getOrderHash(order);
console.log(orderHash);

var typedOrder = eip712Util.orderToTypedData(order);
console.log(typedOrder);
var typedOrderHash = eip712Util.getEIP712Message(typedOrder);
console.log(typedOrderHash);

var cancelOrderTyped = eip712Util.cancelRequestToTypedData(cancelRequest);
console.log("cancelOrderTyped");
console.log(cancelOrderTyped);


var sig = new pjs.Bitstream();
const signature = ethUtil.ecsign(orderHash, privateKey);
console.log(signature);
const signature2 = ethUtil.ecsign(typedOrderHash, privateKey);
console.log(signature2);

sig.addNumber(1 + 32 + 32, 1);
sig.addNumber(signature.v, 1);
sig.addHex(ethUtil.bufferToHex(signature.r));
sig.addHex(ethUtil.bufferToHex(signature.s));
console.log(sig);

var params = {
	validUntil:"",
	allOrNone: true,
	broker: "",
	wallet: "",
	sig: sig.data,
	dualAuthAddr: "",
	dualAuthPrivateKey: ""
};

var feeParams = {
	tokenFee:"",
	amountFee:"",
	tokenRecipient:"",
	tokenSFeePercentage:"",
	tokenBFeePercentage:"",
	walletSplitPercentage:"",
};

var erc1400Params = {};

var rawOrder = {owner:"", 
	version:0,
	tokenS:"",
	tokenB:"",
	amountS:"",
	validSince:"",
	amountB:"",
	params: params,
	feeParams: feeParams,
	erc1400Params: erc1400Params
};

var submitOrderRequest = {rawOrder: rawOrder};








