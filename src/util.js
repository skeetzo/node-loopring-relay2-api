
// Loopring API Paths
const METHODS = [
	// method name		// api path						// request   		// validators
	[ null,				"timestamp",					"GET",				[]				],
	[ null,				"apiKey",						"GET",				[]				],
	[ null,				"apiKey",						"POST",				[]				],
	[ null,				"storageId",					"GET",				[]				],
	[ null,				"order",						"GET",				[]				],
	[ null,				"order",						"POST",				[]				],
	[ null,				"order",						"DELETE",			[]				],
	[ null,				"orders",						"GET",				[]				],
	[ null,				"exchange/markets",				"GET",				[]				],
	[ null,				"exchange/tokens", 				"GET",				["token"]		],
	[ null,				"exchange/info",				"GET",				[]				],
	[ null,				"depth",						"GET",				[]				],
	[ null,				"ticker",						"GET",				[]				],
	[ null,				"candlestick",					"GET",				[]				],
	[ null,				"price",						"GET",				[]				],
	[ null,				"trade",						"GET",				["trade"]		],
	[ null,				"transfer",						"GET",				["tx"]			],
	[ null,				"account",						"GET",				[]				],
	[ null,				"account",						"POST",				[]				],
	[ null,				"user/createInfo",				"GET",				["tx"]			],
	[ null,				"user/updateInfo",				"GET",				["tx"]			],
	[ null,				"user/balances",				"GET",				["tx"]			],
	[ null,				"user/deposits",				"GET",				["tx"]			],
	[ null,				"user/withdrawals",				"GET",				["tx"]			],
	[ null,				"user/withdrawals",				"POST",				["tx"]			],		
	[ null,				"user/transfers",				"GET",				["tx"]			],
	[ null,				"user/trades",					"GET",				["trade"]		],
	[ null,				"user/orderFee", 				"GET",				[]				],
	[ null,				"user/orderUserRateAmount",		"GET",				[]				],
	[ null,				"user/offchainFee",				"GET",				[]				],
	[ null,				"amm/pools",					"GET",				["pool"]		],
	[ null,				"amm/balance",					"GET",				["pool"]		],
	[ null,				"amm/join",						"GET",				["tx","pool"]	],
	[ null,				"amm/exit",						"POST",				["tx","pool"]	],
	[ null,				"amm/user/transactions",		"GET",				["tx"]			],
	[ null,				"amm/user/trades",				"GET",				["trade"]		],
	[ null,				"block/getBlock",				"GET",				["block"]		],
	[ null,				"block/getPendingRequests",		"GET",				["block"]		]
];

// exchange/markets -> exchangeMarkets_GET
for (const method in METHODS)
	method[0] = method[1].replace(/\/[a-z]/g, x => x[1].toUpperCase())+"_"+method[2];

////////////////////////////////////////////////////////////////////////////////////////////////////

const web3Rules = {}

const web3Validator = {
	"name": "WEB3",
	"isDefault": true,
	"contentTypes": ["web3"],
	"rules": web3Rules,
	"match": function(response) {
		var result = false,
			contentType = response.headers["web3-type"] && response.headers["web3-type"].replace(/ /g, '');
		if (!contentType) return result;
		for (var i=0; i<this.contentTypes.length;i++) {
			result = this.contentTypes[i].trim().toLowerCase() === contentType.trim().toLowerCase();
			if (result) break;
		}
		return result;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// Basic Transaction

// AMM join/exit tx
// {
//   "totalNum" : 10,
//   "transactions" : [
//     {
//       "hash" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//       "txType" : "join",
//       "txStatus" : "processing",

//       "updatedAt" : 1608209538074,
//       "blockId" : integer,
//       "indexInBlock" : integer
//     }
//   ]
// }
// {
//   "totalNum" : 1,
//   "transactions" : [
//     {
//       "id" : 1,
//       "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
//       "owner" : "0xC0Cf3f78529AB90F765406f7234cE0F2b1ed69Ee",
//       "txHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
//       "feeTokenSymbol" : "ETH",
//       "feeAmount" : "1000000000000000",
//       "status" : "processing",
//       "progress" : "100%",
//       "timestamp" : 1578572292000,
//       "blockNum" : 100,
//       "updatedAt" : 1578572292000,
//       "blockId" : integer,
//       "indexInBlock" : integer
//     }
//   ]
// }
// {
//   "totalNum" : 1,
//   "transactions" : [
//     {
//       "id" : 1,
//       "txType" : "FORCE_WITHDRAWAL",
//       "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
//       "symbol" : "LRC",
//       "amount" : "1000000000000000000",
//       "txHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
//       "feeTokenSymbol" : "ETH",
//       "feeAmount" : "1000000000000000",
//       "status" : "processing",
//       "progress" : "100%",
//       "timestamp" : 1578572292000,
//       "blockNum" : 100,
//       "updatedAt" : 1578572292000,
//       "distributeHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
//       "requestId" : 1,
//       "fastStatus" : "EMPTY",
//       "blockId" : integer,
//       "indexInBlock" : integer
//     }
//   ]
// }
const txRules = {
  'transactions.*.hash'          : 	['required', 	 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.txHash'        : 	['regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.distributeHash': 	['regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.txType'		 :  'string',
  'transactions.*.txStatus'		 :  'string',
  'transactions.*.feeTokenSymbol':  'string',
  'transactions.*.feeAmount'     : 	'integer',
  'transactions.*.status'        : 	'string',
  'transactions.*.symbol'        : 	'string',
  'transactions.*.amount'        : 	'integer',
  'transactions.*.progress'      : 	'string',
  'transactions.*.timestamp'     : 	'integer',
  'transactions.*.blockNum'      : 	'integer',
  'transactions.*.blockId'       : 	'required:integer',
  'transactions.*.indexInBlock'  : 	'required:integer',
  'transactions.*.updatedAt'     : 	'required:integer'
};
const txValidator = {
	"name": "TX",
	"contentTypes": ["tx"],
	"rules": txRules
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// pool configuration
// {
//   "pools" : [
//     {
//       "name" : "LRC-USDT-Pool-1",
//       "market" : "AMM-LRC-USDT",
//       "address" : "0xa6fa83b62b09174694EFD7EE3aE608ad478a138E",
//       "version" : "1.0.0",
//       "tokens" : {
//         "pooled" : [2,3,5],
//         "lp" : 0
//       },
//       "feeBips" : 6,
//       "precisions" : {
//         "price" : 6,
//         "amount" : 6
//       },
//       "createdAt" : "1609466400000",
//       "status" : 7
//     }
//   ]
// }
// AMM join/exit tx
// {
//   "totalNum" : 10,
//   "transactions" : [
//     {
//       // "hash" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//       // "txType" : "join",
//       // "txStatus" : "processing",
//       "ammPoolAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//       "ammLayerType" : "layer_2",
//       "poolTokens" : [
//         {
//           "tokenId" : 0,
//           "amount" : "1000000",
//           "actualAmount" : "100000",
//           "feeAmount" : "500000"
//         }
//       ],
//       "lpToken" : {
//         "tokenId" : 0,
//         "amount" : "1000000",
//         "actualAmount" : "100000",
//         "feeAmount" : "500000"
//       },
//       "createdAt" : 1608189538074,
//       // "updatedAt" : 1608209538074,
//       // "blockId" : integer,
//       // "indexInBlock" : integer
//     }
//   ]
// }
// AMM pool trade tx
// {
//   "totalNum" : 12345,
//   "trades" : [
//     {
//       "accountId" : 12345,
//       "orderHash" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//       "market" : "AMM-DAI-ETH",
//       "side" : "BUY",
//       "size" : "100000000",
//       "price" : 0.03,
//       "feeAmount" : "100000000",
//       "createdAt" : 1608189538074
//     }
//   ]
// }
const poolRules = {
  'pools.*.name'		 	 				:  'required:string',
  'pools.*.market'		 	 				:  'required:string',
  'pools.*.address'          				: 	['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'pools.*.version'		 	 				:  'required:string',
  'pools.*.tokens.pooled'		 	 		:  'required:array',
  'pools.*.tokens.lp'		 	 			:  'required:integer',
  'pools.*.feeBips'		 	 				:  'required:integer',
  'pools.*.precisions.price'		 	 	:  'required:integer',
  'pools.*.precisions.amount'		 	 	:  'required:integer',
  'pools.*.createdAt'		 	 			:  'required:integer',
  'pools.*.status'		 	 				:  'required:integer',

  'transactions.*.ammPoolAddress'		 	:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.ammLayerType'				:   'required:string',
  'transactions.*.poolTokens.*.tokenId'     : 	'required:integer',
  'transactions.*.poolTokens.*.amount'      : 	'required:string',
  'transactions.*.poolTokens.*.actualAmount': 	'required:string',
  'transactions.*.poolTokens.*.feeAmount'   : 	'required:integer',
  'transactions.*.lpToken.tokenId'      	: 	'required:integer',
  'transactions.*.lpToken.amount'      		: 	'required:integer',
  'transactions.*.lpToken.actualAmount'     : 	'required:integer',
  'transactions.*.lpToken.feeAmount'        : 	'required:integer',
  'transactions.*.createdAt'		 		:   'required:integer',

  'trades.*.accountId'       				: 	'required:integer',
  'trades.*.orderHash'  					: 	['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'trades.*.market'     					: 	'required:string',
  'trades.*.side'     						: 	'required:string',
  'trades.*.size'     						: 	'required:integer',
  'trades.*.price'     						: 	'required:integer',
  'trades.*.feeAmount'     					: 	'required:integer',
  'trades.*.createdAt'     					: 	'required:integer'
};
const poolValidator = {
	"name": "POOL",
	"contentTypes": ["pool"],
	"rules": poolRules
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// token
// {
//   "type" : "ERC20",
//   "tokenId" : 2,
//   "symbol" : "LRC",
//   "name" : "Loopring",
//   "address" : "0x97241525fe425C90eBe5A41127816dcFA5954b06",
//   "decimals" : 18,
//   "precision" : 6,
//   "precisionForOrder" : 6,
//   "orderAmounts" : {
//     "minimum" : "10000000000000000",
//     "maximum" : "1000000000000000000",
//     "dust" : "1000000000000000"
//   },
//   "luckyTokenAmounts" : {
//     "minimum" : "10000000000000000",
//     "maximum" : "1000000000000000000",
//     "dust" : "1000000000000000"
//   },
//   "fastWithdrawLimit" : "1000000000000000",
//   "gasAmounts" : {
//     "distribution" : "1000000000000000",
//     "deposit" : "1000000000000000"
//   },
//   "enabled" : true
// }
const tokenRules = {
  'type'		 	 			:  'required:string',
  'tokenId'		 	 			:  'required:integer',
  'symbol'		 	 			:  'required:string',
  'name'		 	 			:  'required:string',
  'address'          			: 	['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'decimals'		 	 		:  'required:integer',
  'precision'		 	 		:  'required:integer',
  'precisionForOrder'		 	:  'required:integer',
  'orderAmounts.minimum'		:  'required:integer',
  'orderAmounts.maximum'		:  'required:integer',
  'orderAmounts.dust'		 	:  'required:integer',
  'luckyTokenAmounts.minimum'	:  'required:integer',
  'luckyTokenAmounts.maximum'	:  'required:integer',
  'luckyTokenAmounts.dust'		:  'required:integer',
  'fastWithdrawLimit'		 	:  'required:integer',
  'gasAmounts.distribution'		:  'required:integer',
  'gasAmounts.deposit'		 	:  'required:integer',
  'enabled'		 	 			:  'required:boolean'
}
const tokenValidator = {
	"name": "TOKEN",
	"contentTypes": ["token"],
	"rules": tokenRules
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// get pending tx
// {
//   "txType" : "transfer",
//   "accountId" : 10006,
//   "owner" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//   "token" : {
//     "tokenId" : 6,
//     "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//     "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "amount" : "100"
//   },
//   "toToken" : {
//     "tokenId" : 6,
//     "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//     "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "amount" : "100"
//   },
//   "fee" : {
//     "tokenId" : 6,
//     "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//     "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "amount" : "100"
//   },
//   "validUntil" : 1627904776,
//   "toAccountId" : 10006,
//   "toAccountAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//   "storageId" : 2,
//   "orderA" : {
//     "storageID" : 6,
//     "accountID" : 10006,
//     "amountS" : "100",
//     "amountB" : "600",
//     "tokenS" : 6,
//     "tokenB" : 32768,
//     "validUntil" : 1235123512,
//     "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "feeBips" : 60,
//     "isAmm" : true,
//     "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "fillS" : 500
//   },
//   "orderB" : {
//     "storageID" : 6,
//     "accountID" : 10006,
//     "amountS" : "100",
//     "amountB" : "600",
//     "tokenS" : 6,
//     "tokenB" : 32768,
//     "validUntil" : 1235123512,
//     "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "feeBips" : 60,
//     "isAmm" : true,
//     "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "fillS" : 500
//   },
//   "valid" : false,
//   "nonce" : 65,
//   "minterAccountId" : 10008,
//   "minter" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//   "nftToken" : {
//     "tokenId" : 6,
//     "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//     "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//     "amount" : "100"
//   },
//   "nftType" : "eip1155"
// }
const tradeRules = {}

const tradeValidator = {
	"name": "TRADE",
	"contentTypes": ["trade"],
	"rules": tradeRules
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// L2 block info
// {
//   "blockId" : 1235,
//   "blockSize" : 64,
//   "exchange" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//   "txHash" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//   "status" : "pending",
//   "createdAt" : 1627904776000,
//   "transactions" : [
//     {
//       "txType" : "transfer",
//       "accountId" : 10006,
//       "owner" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//       "token" : {
//         "tokenId" : 6,
//         "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//         "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "amount" : "100"
//       },
//       "toToken" : {
//         "tokenId" : 6,
//         "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//         "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "amount" : "100"
//       },
//       "fee" : {
//         "tokenId" : 6,
//         "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//         "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "amount" : "100"
//       },
//       "validUntil" : 1627904776,
//       "toAccountId" : 10006,
//       "toAccountAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//       "storageId" : 2,
//       "orderA" : {
//         "storageID" : 6,
//         "accountID" : 10006,
//         "amountS" : "100",
//         "amountB" : "600",
//         "tokenS" : 6,
//         "tokenB" : 32768,
//         "validUntil" : 1235123512,
//         "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "feeBips" : 60,
//         "isAmm" : true,
//         "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "fillS" : 500
//       },
//       "orderB" : {
//         "storageID" : 6,
//         "accountID" : 10006,
//         "amountS" : "100",
//         "amountB" : "600",
//         "tokenS" : 6,
//         "tokenB" : 32768,
//         "validUntil" : 1235123512,
//         "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "feeBips" : 60,
//         "isAmm" : true,
//         "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "fillS" : 500
//       },
//       "valid" : false,
//       "nonce" : 65,
//       "minterAccountId" : 10008,
//       "minter" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//       "nftToken" : {
//         "tokenId" : 6,
//         "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
//         "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
//         "amount" : "100"
//       },
//       "nftType" : "eip1155"
//     }
//   ]
// }
const blockRules = {
  'blockId'		 	 					:  'required:string',
  'blockSize'		 	 				:  'required:integer',
  'exchange'		 	 				:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'txHash'		 	 					:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'status'          					:  'required:string',
  'createdAt'		 	 				:  'required:integer',
  //
  'transactions.*.txType'		 	 	:  'required:string',
  'transactions.*.accountId'		 	:  'required:integer',
  'transactions.*.owner'				:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  //
  'transactions.*.token.tokenId'		:  'required:integer',
  'transactions.*.token.tokenAddress'	:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.token.nftData'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.token.nftId'			:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.token.amount'			:  'required:integer',
  //
  'transactions.*.toToken.tokenId'		:  'required:integer',
  'transactions.*.toToken.tokenAddress'	:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.toToken.nftData'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.toToken.nftId'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.toToken.amount'		:  'required:integer',
  //
  'transactions.*.fee.tokenId'			:  'required:integer',
  'transactions.*.fee.tokenAddress'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.fee.nftData'			:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.fee.nftId'			:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.fee.amount'			:  'required:integer',
  //
  'transactions.*.validUntil'		 	:  'required:integer',
  'transactions.*.toAccountId'			:  'required:integer',
  'transactions.*.toAccountAddress'		:  'required:integer',
  'transactions.*.storageId'		 	:  'required:integer',
  //
  'transactions.*.orderA.storageID'		:  'required:integer',
  'transactions.*.orderA.accountID'		:  'required:integer',
  'transactions.*.orderA.amountS'		:  'required:integer',
  'transactions.*.orderA.amountB'		:  'required:integer',
  'transactions.*.orderA.tokenS'		:  'required:integer',
  'transactions.*.orderA.tokenB'		:  'required:integer',
  'transactions.*.orderA.validUntil'	:  'required:integer',
  'transactions.*.orderA.taker'		 	:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.orderA.feeBips'		:  'required:integer',
  'transactions.*.orderA.isAmm'		 	:  'required:integer',
  'transactions.*.orderA.nftData'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.orderA.fillS'		 	:  'required:integer',
  //
  'transactions.*.orderB.storageID'		:  'required:integer',
  'transactions.*.orderB.accountID'		:  'required:integer',
  'transactions.*.orderB.amountS'		:  'required:integer',
  'transactions.*.orderB.amountB'		:  'required:integer',
  'transactions.*.orderB.tokenS'		:  'required:integer',
  'transactions.*.orderB.tokenB'		:  'required:integer',
  'transactions.*.orderB.validUntil'	:  'required:integer',
  'transactions.*.orderB.taker'		 	:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.orderB.feeBips'		:  'required:integer',
  'transactions.*.orderB.isAmm'		 	:  'required:integer',
  'transactions.*.orderB.nftData'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.orderB.fillS'		 	:  'required:integer',
  //
  'transactions.*.valid'		 	 	:  'required:integer',
  'transactions.*.nonce'		 	 	:  'required:integer',
  'transactions.*.minterAccountId'		:  'required:integer',
  'transactions.*.minter'		 	 	:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.nftToken.tokenId'		:  'required:integer',
  'transactions.*.nftToken.tokenAddress':  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.nftToken.nftData'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.nftToken.nftId'		:  ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  'transactions.*.nftToken.amount'		:  'required:integer',
  'transactions.*.nftType'		 	 	:  'required:string'
}
const blockValidator = {
	"name": "BLOCK",
	"contentTypes": ["block"],
	"rules": blockRules
}

////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
	METHODS,
	web3Validator,
	txValidator,
	poolValidator,
	tokenValidator,
	tradeValidator,
	blockValidator
}