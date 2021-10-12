"use strict";

const ABI = require("ethereumjs-abi");
const ethUtil = require("ethereumjs-util");
const BN = require("bn.js");
const bignumber = require("bignumber.js");
var web3Util = require('web3-utils');

const TYPED_MESSAGE_SCHEMA = {
    type: "object",
    properties: {
        types: {
            type: "object",
            additionalProperties: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                    },
                    required: ["name", "type"],
                },
            },
        },
        primaryType: { type: "string" },
        domain: { type: "object" },
        message: { type: "object" },
    },
    required: ["types", "primaryType", "domain", "message"],
};

function orderToTypedData(order) {
    const typedData = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
            ],
            Order: [
                { name: "amountS", type: "uint" },
                { name: "amountB", type: "uint" },
                { name: "feeAmount", type: "uint" },
                { name: "validSince", type: "uint" },
                { name: "validUntil", type: "uint" },
                { name: "owner", type: "address" },
                { name: "tokenS", type: "address" },
                { name: "tokenB", type: "address" },
                { name: "dualAuthAddr", type: "address" },
                { name: "broker", type: "address" },
                { name: "orderInterceptor", type: "address" },
                { name: "wallet", type: "address" },
                { name: "tokenRecipient", type: "address" },
                { name: "feeToken", type: "address" },
                { name: "walletSplitPercentage", type: "uint16" },
                { name: "tokenSFeePercentage", type: "uint16" },
                { name: "tokenBFeePercentage", type: "uint16" },
                { name: "allOrNone", type: "bool" },
                { name: "tokenTypeS", type: "uint8" },
                { name: "tokenTypeB", type: "uint8" },
                { name: "tokenTypeFee", type: "uint8" },
                { name: "trancheS", type: "bytes32" },
                { name: "trancheB", type: "bytes32" },
                { name: "transferDataS", type: "bytes" },
            ],
        },
        primaryType: "Order",
        domain: {
            name: "Loopring Protocol",
            version: "2",
        },
        message: {
            amountS: toBN(order.amountS),
            amountB: toBN(order.amountB),
            feeAmount: toBN(order.feeAmount),
            validSince: order.validSince ? toBN(order.validSince) : toBN(0),
            validUntil: order.validUntil ? toBN(order.validUntil) : toBN(0),
            owner: order.owner,
            tokenS: order.tokenS,
            tokenB: order.tokenB,
            dualAuthAddr: order.dualAuthAddr ? order.dualAuthAddr : "",
            broker: order.broker ? order.broker : "",
            orderInterceptor: order.orderInterceptor ? order.orderInterceptor : "",
            wallet: order.walletAddr ? order.walletAddr : "",
            tokenRecipient: order.tokenRecipient,
            feeToken: order.feeToken,
            walletSplitPercentage: order.walletSplitPercentage,
            tokenSFeePercentage: order.tokenSFeePercentage,
            tokenBFeePercentage: order.tokenBFeePercentage,
            allOrNone: order.allOrNone,
            tokenTypeS: order.tokenTypeS ? order.tokenTypeS : 0,
            tokenTypeB: order.tokenTypeB ? order.tokenTypeB : 0,
            tokenTypeFee: order.tokenTypeFee ? order.tokenTypeFee : 0,
            trancheS: order.trancheS ? order.trancheS : "",
            trancheB: order.trancheB ? order.trancheB : "",
            transferDataS: order.transferDataS ? order.transferDataS : "",
        },
    };
    return typedData;
};

exports.orderToTypedData = orderToTypedData;

function cancelRequestToTypedData(cancelRequest) {
    console.log(cancelRequest);
    console.log(cancelRequest.marketPair.baseToken);
    console.log(cancelRequest.marketPair.quoteToken);

    var bToken = web3Util.toBN(cancelRequest.marketPair.baseToken);
    var qToken = web3Util.toBN(cancelRequest.marketPair.quoteToken);
    var marketHash = '0x' + bToken.xor(qToken).toString(16);

    const typedData = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
            ],
            CancelRequest: [
                { name: "id", type: "bytes32" },
                { name: "owner", type: "address" },
                { name: "market", type: "address" },
                { name: "time", type: "uint" },
            ],
        },
        primaryType: "CancelRequest",
        domain: {
            name: "Loopring Protocol",
            version: "2",
        },
        message: {
            id: cancelRequest.id,
            owner: cancelRequest.owner,
            market: marketHash,
            time: toBN(cancelRequest.time),
        },
    };
    return typedData;
 };

exports.cancelRequestToTypedData = cancelRequestToTypedData;

function toBN(n) {
    return new BN((new bignumber.BigNumber(n)).toString(10), 10);
};

function getEIP712Message(typedData) {
    const sanitizedData = sanitizeData(typedData);
    const parts = [Buffer.from("1901", "hex")];
    parts.push(hashStruct("EIP712Domain", sanitizedData.domain, sanitizedData.types));
    parts.push(hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types));
    return ethUtil.keccak(Buffer.concat(parts));
}
exports.getEIP712Message = getEIP712Message;


function sanitizeData(data) {
    const sanitizedData = {};
    for (const key in TYPED_MESSAGE_SCHEMA.properties) {
        console.log(key);
        console.log(data[key]);
        if (key && data[key]) {
            sanitizedData[key] = data[key];
        }
    }
    console.log(sanitizedData);
    return sanitizedData;
}
exports.sanitizeData = sanitizeData;


function hashStruct(primaryType, data, types) {
    const encodedData = encodeData(primaryType, data, types);
    return ethUtil.keccak(encodedData);
}


function encodeData(primaryType, data, types) {
    const encodedTypes = ["bytes32"];
    const encodedValues = [hashType(primaryType, types)];
    for (const field of types[primaryType]) {
        let value = data[field.name];
        if (value !== undefined) {
            if (field.type === "string" || field.type === "bytes") {
                encodedTypes.push("bytes32");
                value = ethUtil.keccak(value);
                encodedValues.push(value);
            }
            else if (types[field.type] !== undefined) {
                encodedTypes.push("bytes32");
                value = ethUtil.keccak(encodeData(field.type, value, types));
                encodedValues.push(value);
            }
            else if (field.type.lastIndexOf("]") === field.type.length - 1) {
                throw new Error("Arrays currently unimplemented in encodeData");
            }
            else {
                encodedTypes.push(field.type);
                encodedValues.push(value);
            }
        }
    }
    return ABI.rawEncode(encodedTypes, encodedValues);
}


function hashType(primaryType, types) {
    return ethUtil.keccak(encodeType(primaryType, types));
}


function encodeType(primaryType, types) {
    let result = "";
    let deps = findTypeDependencies(primaryType, types).filter((dep) => dep !== primaryType);
    deps = [primaryType].concat(deps.sort());
    for (const type of deps) {
        const children = types[type];
        if (!children) {
            throw new Error("No type definition specified: ${type}");
        }
        result += `${type}(${types[type].map((o) => `${o.type} ${o.name}`).join(",")})`;
    }
    return result;
}


function findTypeDependencies(primaryType, types, results = []) {
    if (results.includes(primaryType) || types[primaryType] === undefined) {
        return results;
    }
    results.push(primaryType);
    for (const field of types[primaryType]) {
        for (const dep of findTypeDependencies(field.type, types, results)) {
            if (!results.includes(dep)) {
                results.push(dep);
            }
        }
    }
    return results;
}
