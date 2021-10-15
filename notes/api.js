

get
get server timestamp
/api/v3/timestamp
Returns the relayer's current time in millisecond
{
  "timestamp" : 1584683483382
}

get api key
Get the ApiKey associated with the user's account.
/api/v3/apiKey
accountId 	integer 	Y 	AccountID 	10
{
  "apiKey" : "6BJaCehh0z4ta4TW5vwoKyo0yk5FdXkQxpt8AStG49aU3dMNC9jid6syyWPEMtTt"
}

update api key
Change the ApiKey associated with the user's account. The current ApiKey must be provided as the value of the X-API-KEY HTTP header.
/api/v3/apiKey
X-API-KEY 	string 	Y 	ApiKey 	"HlkcGxbqBeaF76j4rvPaOasyfPwnkQ
6B6DQ6THZWbvrAGxzEdulXQvOKLrRW
ZLnN"
X-API-SIG 	string 	Y 	EDDSA Signature 	"0xeb14773e8a07d19bc4fe56e36d041dcb
0026bf21e05c7652f7e92160deaf5ea9
c4fe56e34773e86d041dcbeb1a07d19b
002652f7e92160deaf5e6bf21e05c7a9
002652f7e92160deaf5e6bf21e05c7a9
eb14773e8a07d19bc4fe56e36d041dcb"
{
  "apiKey" : "6BJaCehh0z4ta4TW5vwoKyo0yk5FdXkQxpt8AStG49aU3dMNC9jid6syyWPEMtTt"
}

get next storage id
/api/v3/storageId
Fetches the next order id for a given sold token. If the need arises to repeatedly place orders in a short span of time, the order id can be initially fetched through the API and then managed locally. Each new order id can be derived from adding 2 to the last one
accountId 	integer 	Y 	Looprings account identifier 	1
sellTokenId 	integer 	Y 	The unique identifier of the token which the user wants to sell in the next order. 	0
maxNext 	boolean 	N 	Return the max of the next available storageId, so any storageId > returned value is avaliable, to help user manage storageId by themselves. for example, if [20, 60, 100] is avaliable, all other ids < 100 is used before, user gets 20 if flag is false (and 60 in next run), but gets 100 if flag is true, so he can use 102, 104 freely 	"0"
{
  "orderId" : 100,
  "offchainId" : 101
}

get order details
/api/v3/order
Get the details of an order based on order hash.
accountId 	integer 	Y 	Account ID, could be empty if hash query is presented. 	1
orderHash 	string 	Y 	Order hash 	"133754509012
921794171549
748495717930
699115173547
203971250276
332426804700
75859"
{
  "hash" : "0xfb5e711c2f044e94322ed262229cd8f0d0da00c22e1a00a0f5d881e45a38e1cf",
  "clientOrderId" : "200310143135081332",
  "side" : "SELL",
  "market" : "LRC-ETH",
  "price" : "0.01987608",
  "volumes" : {
    "baseAmount" : "0",
    "quoteAmount" : "0",
    "baseFilled" : "0",
    "quoteFilled" : "0",
    "fee" : "0"
  },
  "validity" : {
    "start" : 0,
    "end" : 0
  },
  "orderType" : "LIMIT_ORDER",
  "tradeChannel" : "ORDER_BOOK",
  "status" : "processing"
}

submit an order
POST
/api/v3/order
Submit an order
exchange 	string 	Y 	The adderss of the exchange which has to process this order 	"1"
accountId 	integer 	Y 	Loopring's account ID 	1
storageId 	integer 	Y 	The unique identifier of the L2 Merkle tree storage slot where the burn made in order to exit the pool will or has been stored. 	1
sellToken 	Token
VolumeV3 	Y 	Wrapper object used to describe a token associated with a certain quantity. 	"TokenVolume{
tokenId: 0, volume: 1234}"
buyToken 	Token
VolumeV3 	Y 	Wrapper object used to describe a token associated with a certain quantity. 	"TokenVolume{
tokenId: 0, volume: 1234}"
allOrNone 	string 	Y 	Whether the order supports partial fills or not.Currently only supports false as a valid value 	"false"
fillAmountBOrS 	string 	Y 	Fill size by buy token or by sell token 	"true"
validUntil 	integer 	Y 	Order expiration time, accuracy is in seconds 	1567053142
maxFeeBips 	integer 	Y 	Maximum order fee that the user can accept, value range (in ten thousandths) 1 ~ 63 	20
eddsaSignature 	string 	Y 	The orders EdDSA signature. The signature is a hexadecimal string obtained by signing the order itself and concatenating the resulting signature parts (Rx, Ry, and S). Used to authenticate and authorize the operation. 	"133754509012
921794171549
748495717930
699115173547
203971250276
332426804700
75859"
clientOrderId 	string 	N 	An arbitrary, client-set unique order identifier, max length is 120 bytes 	"1"
orderType 	string 	N 	Order types, can be AMM, LIMIT_ORDER, MAKER_ONLY, TAKER_ONLY
Allowable : ['LIMIT_ORDER', 'TAKER_ONLY', 'MAKER_ONLY', 'AMM'] 	"LIMIT_ORDER"
tradeChannel 	string 	N 	Order channel, can be ORDER_BOOK, AMM_POOL, MIXED
Allowable : ['ORDER_BOOK', 'AMM_POOL', 'MIXED'] 	"ORDER_BOOK"
taker 	string 	N 	Used by the P2P order which user specify the taker, so far its 0x0000000000000000000000000000000000000000 	"0x506d67A6f2
2927a2DAa20a
9510EA73D5E6
6Baf18"
poolAddress 	string 	N 	The AMM pool address if order type is AMM 	"0x506d67A6f2
2927a2DAa20a
9510EA73D5E6
6Baf18"
affiliate 	string 	N 	An accountID who will recieve a share of the fee of this order 	"10068"
{
  "hash" : "13375450901292179417154974849571793069911517354720397125027633242680470075859",
  "clientOrderId" : "client_order_id",
  "status" : "cancelled",
  "isIdempotent" : false
}

cancel order
DELETE
/api/v3/order
Cancel order using order hash or client-side ID.
accountId 	integer 	Y 	Account ID 	1
orderHash 	string 	N 	Order HASH 	"133754509012
921794171549
748495717930
699115173547
203971250276
332426804700
75859"
clientOrderId 	string 	N 	The unique order ID of the client 	"202003180000
00001010"
{
  "hash" : "13375450901292179417154974849571793069911517354720397125027633242680470075859",
  "clientOrderId" : "client_order_id",
  "status" : "cancelled",
  "isIdempotent" : false
}

get multiple orders
/api/v3/orders
accountId 	integer 	Y 	Account ID 	1
market 	string 	N 	Trading pair 	"LRC-ETH"
start 	integer 	N 	Lower bound of order's creation timestamp in millisecond
Default : 0L 	1567053142000
end 	integer 	N 	Upper bound of order's creation timestamp in millisecond
Default : 0L 	1567053242000
side 	string 	N 	"BUY" or "SELL"
Allowable : ['BUY', 'SELL'] 	"BUY"
status 	string 	N 	Order status. You can specify one of the following values:
Allowable : ['processing', 'processed', 'failed', 'cancelled', 'cancelling', 'expired'] 	"processing,p
rocessed"
limit 	integer 	N 	Limit of orders (default 50) 	50
offset 	integer 	N 	Offset of orders (default 0)
Default : 0L 	0
orderTypes 	string 	N 	request.getOrders.orderTypes
Allowable : ['LIMIT_ORDER', 'MAKER_ONLY', 'TAKER_ONLY', 'AMM'] 	"LIMIT_ORDER"
tradeChannels 	string 	N 	field.SubmitOrderRequest.tradeChannel
Allowable : ['ORDER_BOOK:0', 'AMM_POOL:1', 'MIXED:2'] 	"ORDER_BOOK,A
MM_POOL"
{
  "totalNum" : 10,
  "orders" : [
    {
      "hash" : "0xfb5e711c2f044e94322ed262229cd8f0d0da00c22e1a00a0f5d881e45a38e1cf",
      "clientOrderId" : "200310143135081332",
      "side" : "SELL",
      "market" : "LRC-ETH",
      "price" : "0.01987608",
      "volumes" : {
        "baseAmount" : "0",
        "quoteAmount" : "0",
        "baseFilled" : "0",
        "quoteFilled" : "0",
        "fee" : "0"
      },
      "validity" : {
        "start" : 0,
        "end" : 0
      },
      "orderType" : "LIMIT_ORDER",
      "tradeChannel" : "ORDER_BOOK",
      "status" : "processing"
    }
  ]
}

get market configurations
/api/v3/exchange/markets
Returns the configurations of all supported markets (trading pairs)
{
  "markets" : [
    {
      "market" : "LRC-USDT",
      "baseTokenId" : 2,
      "quoteTokenId" : 0,
      "precisionForPrice" : 6,
      "orderbookAggLevels" : 4,
      "enabled" : false
    }
  ]
}

get token configurations
/api/v3/exchange/tokens
Returns the configurations of all supported tokens, including Ether.
{
  "type" : "ERC20",
  "tokenId" : 2,
  "symbol" : "LRC",
  "name" : "Loopring",
  "address" : "0x97241525fe425C90eBe5A41127816dcFA5954b06",
  "decimals" : 18,
  "precision" : 6,
  "precisionForOrder" : 6,
  "orderAmounts" : {
    "minimum" : "10000000000000000",
    "maximum" : "1000000000000000000",
    "dust" : "1000000000000000"
  },
  "luckyTokenAmounts" : {
    "minimum" : "10000000000000000",
    "maximum" : "1000000000000000000",
    "dust" : "1000000000000000"
  },
  "fastWithdrawLimit" : "1000000000000000",
  "gasAmounts" : {
    "distribution" : "1000000000000000",
    "deposit" : "1000000000000000"
  },
  "enabled" : true
}

get exchange configurations
/api/v3/exchange/info
Return various configurations of Loopring.io
{
  "chainId" : 1,
  "exchangeAddress" : "0xbA1D5779131aa529F51B4B00186E9e97f3BeB854",
  "depositAddress" : "0xbA1D5779131aa529F51B4B00186E9e97f3BeB854",
  "onchainFees" : [
    {
      "type" : "withdraw",
      "fee" : "2000000000000000"
    }
  ],
  "openAccountFees" : [
    {
      "token" : "ETH",
      "fee" : "2000000000000000"
    }
  ],
  "updateFees" : [
    {
      "token" : "ETH",
      "fee" : "2000000000000000"
    }
  ],
  "transferFees" : [
    {
      "token" : "ETH",
      "fee" : "2000000000000000"
    }
  ],
  "withdrawalFees" : [
    {
      "token" : "ETH",
      "fee" : "2000000000000000"
    }
  ],
  "fastWithdrawalFees" : [
    {
      "token" : "ETH",
      "fee" : "2000000000000000"
    }
  ],
  "ammExitFees" : [
    {
      "token" : "ETH",
      "fee" : "2000000000000000"
    }
  ]
}

get market orderbook
/api/v3/depth
market 	string 	Y 	The ID of a trading pair. 	"LRC-ETH"
level 	integer 	Y 	Order book aggregation level, larger value means further price aggregation. 	2
limit 	integer 	N 	Maximum numbers of bids/asks.
Default : 50 	50
{
  "version" : 147,
  "timestamp" : 432312312,
  "market" : "LRC-ETH",
  "bids" : [["0.002","21000","33220000","4"]],
  "asks" : []
}

get market ticker
/api/v3/ticker
Gets a markets ticker. Generally speaking, a ticker in Loopring consists in data from the market taken last 24Hours.
market 	string 	Y 	Market pair, support multiple markets 	"LRC-ETH,LRC-
USDT"
{
  "tickers" : [["LRC-ETH", "1584565505000","1000","1000","1000","1000","1000","1000","1000","1000","1000", "0", "0"]]
}

get market candlestick
/api/v3/candlestick
Return the candlestick data of a given trading pair.
market 	string 	Y 	Trading pair ID, multi-market is not supported 	"LRC-ETH"
interval 	string 	Y 	Candlestick interval, Supported values are: 1min, 5min, 15min, 30min, 1hr, 2hr, 4hr, 12hr, 1d, 1w 	"5min"
start 	integer 	N 	Start time 	1584479105000
end 	integer 	N 	End time 	1584565505000
limit 	integer 	N 	Number of data points. If more data points are available, the API will only return the first 'limit' data points. 	120
{
  "candlesticks" : [["1584565500000","5","1.5","5.5","8.8","0.5","0.5","0.5"]]
}

get token fiat prices
/api/v3/price
Fetches, for all the tokens supported by Loopring, their fiat price.
legal 	string 	Y 	The fiat currency to uses. Currently the following values are supported: USD,CNY,JPY,EUR,GBP,HKD 	"USD"
{
  "prices" : [
    {
      "symbol" : "LRC",
      "price" : "0",
      "updatedAt" : 0
    }
  ]
}

get market recent trades
/api/v3/trade
Query trades with specified market
market 	string 	Y 	Single market to query 	"LRC-USDT"
limit 	integer 	N 	Number of queries 	20
fillTypes 	string 	N 	request.getUserTxs.fillTypes
Allowable : ['dex', 'amm'] 	"dex"
{
  "totalNum" : 0,
  "trades" : [["0","0","BUY","0","0","LRC-USDT","0"]]
}

submit internal transfer
POST
/api/v3/transfer
Submit internal transfer
exchange 	string 	Y 	exchange address 	"1"
payerId 	integer 	Y 	payer account ID 	1
payerAddr 	string 	Y 	payer account address 	"0xABCD"
payeeId 	integer 	Y 	payee account ID 	1
payeeAddr 	string 	Y 	payer account address 	"0xCDEF"
token 	Token
VolumeV3 	Y 	token to be transfer 	"{tokenId: 0, volume: 1000000}"
maxFee 	Token
VolumeV3 	Y 	maximum fee of the transfer 	"{tokenId: 0, volume: 1000000}"
storageId 	integer 	Y 	offchain Id 	1
validUntil 	integer 	Y 	Timestamp for order to become invalid 	1598431481
eddsaSignature 	string 	N 	eddsa signature 	"0xccf0a141fc
e2dc5cbbd4f8
02c52220e9e2
ce260e86704d
6258603eb346
eefe2d4a4500
05c362b223b2
8402d087f706
5ea5eee03145
31adf6a580fc
e64c25dca81c
02"
ecdsaSignature 	string 	N 	ecdsa signature 	"0xeb14773e8a
07d19bc4fe56
e36d041dcb00
2652f7e92160
deaf5e6bf21e
05c7a9eb1477
3e8a07d19bc4
fe56e36d041d
cb002652f7e9
2160deaf5e6b
f21e05c7a9eb
14773e8a07d1
9bc4fe56e36d
041dcb002652
f7e92160deaf
5e6bf21e05c7
a9"
hashApproved 	string 	N 	An approved hash string which was already submitted on eth mainnet 	"0xf7c9323511
86c3a9053f31
3eefa16209c0
18f7f1dba8aa
8ca7100400f7
c31085"
memo 	string 	N 	transfer memo 	"Air Drop"
clientId 	string 	N 	A user-defined id 	"hebao1234567"
{
  "hash" : "0x1d923ca7834dc90484fa2eb611f0f0bc7e741bb107007ebea19ba8caeab4f9d3",
  "status" : "received",
  "isIdempotent" : true
}

query user information
/api/v3/account
Returns data associated with the user's exchange account.
owner 	string 	Y 	Ethereum address 	"0x123456"
accountId 	integer 	Y 	Account ID 	10
owner 	string 	Y 	Ethereum address 	"0xABCD"
frozen 	boolean 	Y 	The frozen state of the account, true stands for frozen, if the account is frozen, the user cant submit order. 	"false"
publicKey 	Public
Key 	Y 	The user's public key 	"{x:0x241707b
cc6d7a4ccf10
304be248d343
a527e85f61b4
5d721544d027
cc1f2fb5f,y:
0x302f3a521d
bdd1d0eb1944
c8323d4ac3b3
e9c9201f4aa4
3a2565054886
369d9c}"
tags 	string 	N 	Comma separated list of tags such as VIP levels, etc 	"vip_1"
nonce 	integer 	Y 	field.DexAccountV3.nonce 	0
keyNonce 	integer 	Y 	Nonce of users key change request, for backward compatible 	0
keySeed 	string 	Y 	KeySeed of users L2 eddsaKey, the L2 key should be generated from this seed, i.e., L2_EDDSA_KEY=eth.sign(keySeed). Otherwise, user may meet error in login loopring DEX 	"Sign this message to access Loopring Exchange: 0xbbbbca6a90
1c926f240b89
eacb641d8aec
7aeafd with key nonce: 103"{
  "accountId" : 10,
  "owner" : "0xABCD",
  "frozen" : false,
  "publicKey" : {
    "x" : "0x241707bcc6d7a4ccf10304be248d343a527e85f61b45d721544d027cc1f2fb5f",
    "y" : "0x302f3a521dbdd1d0eb1944c8323d4ac3b3e9c9201f4aa43a2565054886369d9c"
  },
  "tags" : "vip_1",
  "nonce" : 0,
  "keyNonce" : 0,
  "keySeed" : "Sign this message to access Loopring Exchange: 0xbbbbca6a901c926f240b89eacb641d8aec7aeafd with key nonce: 103"
}

update account eddsa key
POST
/api/v3/account
Updates the EDDSA key associated with the specified account, making the previous one invalid in the process.
exchange 	string 	Y 	exchange address 	"1"
owner 	string 	Y 	owner address 	"0xB4A7016834
0C7511952301
9f79F5Ffd9c6
0DceC7"
accountId 	integer 	Y 	user account ID 	1
publicKey 	Public
Key 	Y 	The user's public key 	"{x:0x241707b
cc6d7a4ccf10
304be248d343
a527e85f61b4
5d721544d027
cc1f2fb5f,y:
0x302f3a521d
bdd1d0eb1944
c8323d4ac3b3
e9c9201f4aa4
3a2565054886
369d9c}"
maxFee 	Token
VolumeV3 	Y 	maximum of fee token 	"{tokenId: 0, volume: 1000000}"
validUntil 	integer 	Y 	Timestamp for order to become invalid 	1583183141
nonce 	integer 	Y 	Nonce of users exchange account that used in off-chain requests. 	1
keySeed 	string 	N 	KeySeed of users L2 eddsaKey, the L2 key should be generated from this seed, i.e., L2_EDDSA_KEY=eth.sign(keySeed). Otherwise, user may meet error in login loopring DEX 	"Sign this message to access Loopring Exchange: 0xbbbbca6a90
1c926f240b89
eacb641d8aec
7aeafd with key nonce: 103"
eddsaSignature 	string 	N 	eddsa signature of this request 	"0xccf0a141fc
e2dc5cbbd4f8
02c52220e9e2
ce260e86704d
6258603eb346
eefe2d4a4500
05c362b223b2
8402d087f706
5ea5eee03145
31adf6a580fc
e64c25dca81c
02"
ecdsaSignature 	string 	N 	ecdsa signature of this request 	"0xeb14773e8a
07d19bc4fe56
e36d041dcb00
2652f7e92160
deaf5e6bf21e
05c7a9eb1477
3e8a07d19bc4
fe56e36d041d
cb002652f7e9
2160deaf5e6b
f21e05c7a9eb
14773e8a07d1
9bc4fe56e36d
041dcb002652
f7e92160deaf
5e6bf21e05c7
a9"
hashApproved 	string 	N 	An approved hash string which was submitted on eth mainnet 	"0xf7c9323511
86c3a9053f31
3eefa16209c0
18f7f1dba8aa
8ca7100400f7
c31085"
{
  "hash" : "0x1d923ca7834dc90484fa2eb611f0f0bc7e741bb107007ebea19ba8caeab4f9d3",
  "status" : "received",
  "isIdempotent" : true
}

get user registration transactions
/api/v3/user/createInfo
Returns a list Ethereum transactions from users for exchange account registration.
accountId 	integer 	Y 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	1
start 	integer 	N 	Start time in milliseconds
Default : 0L 	1578558098000
end 	integer 	N 	End time in milliseconds
Default : 0L 	1578558098000
status 	string 	N 	Comma separated status values
Allowable : ['processing', 'processed', 'received', 'failed'] 	"processing,p
rocessed"
limit 	integer 	N 	Number of records to return 	50
offset 	integer 	N 	Number of records to skip
Default : 0L 	1
{
  "totalNum" : 1,
  "transactions" : [
    {
      "id" : 1,
      "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "owner" : "0xC0Cf3f78529AB90F765406f7234cE0F2b1ed69Ee",
      "txHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "feeTokenSymbol" : "ETH",
      "feeAmount" : "1000000000000000",
      "status" : "processing",
      "progress" : "100%",
      "timestamp" : 1578572292000,
      "blockNum" : 100,
      "updatedAt" : 1578572292000,
      "blockId" : integer,
      "indexInBlock" : integer
    }
  ]
}

get password reset transactions
/api/v3/user/updateInfo
Returns a list Ethereum transactions from users for resetting exchange passwords.
accountId 	integer 	Y 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	1
start 	integer 	N 	Start time in milliseconds
Default : 0L 	1578558098000
end 	integer 	N 	End time in milliseconds
Default : 0L 	1578558098000
status 	string 	N 	Comma separated status values
Allowable : ['processing', 'processed', 'received', 'failed'] 	"processing,p
rocessed"
limit 	integer 	N 	Number of records to return 	50
offset 	integer 	N 	Number of records to skip
Default : 0L 	1
{
  "totalNum" : 1,
  "transactions" : [
    {
      "id" : 1,
      "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "owner" : "0xC0Cf3f78529AB90F765406f7234cE0F2b1ed69Ee",
      "txHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "feeTokenSymbol" : "ETH",
      "feeAmount" : "1000000000000000",
      "status" : "processing",
      "progress" : "100%",
      "timestamp" : 1578572292000,
      "blockNum" : 100,
      "updatedAt" : 1578572292000,
      "blockId" : integer,
      "indexInBlock" : integer
    }
  ]
}

/api/v3/user/balances
Returns user's Ether and token balances on exchange.
accountId 	integer 	Y 	AccountID 	1
tokens 	string 	N 	Query tokens 	"0,1"
{
  "tokenId" : 10,
  "total" : "100",
  "locked" : "100",
  "pending" : {
    "withdraw" : "10000000000000",
    "deposit" : "10000000000000"
  }
}

get user exchange balances
/api/v3/user/deposits
Returns a list of deposit records for the given user.
accountId 	integer 	N 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	1
start 	integer 	N 	Start time in milliseconds
Default : 0L 	1578558098000
end 	integer 	N 	End time in milliseconds
Default : 0L 	1578558098000
status 	string 	N 	Comma separated status values
Allowable : ['processing', 'processed', 'received', 'failed'] 	"processing,p
rocessed"
limit 	integer 	N 	Number of records to return 	50
tokenSymbol 	string 	N 	Token to filter. If you want to return deposit records for all tokens, omit this parameter 	"ETH"
offset 	integer 	N 	Number of records to skip
Default : 0L 	1
hashes 	string 	N 	The hashes (split by ,) of the transactions, normally its L2 tx hash, except the deposit which uses L1 tx hash. 	"0xf7c9323511
86c3a9053f31
3eefa16209c0
18f7f1dba8aa
8ca7100400f7
c31085"
{
  "totalNum" : 1,
  "transactions" : [
    {
      "id" : 1,
      "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "symbol" : "LRC",
      "amount" : "1000000000000000000",
      "txHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "status" : "processing",
      "progress" : "100%",
      "timestamp" : 1578572292000,
      "blockNum" : 100,
      "updatedAt" : 1578572292000,
      "blockId" : integer,
      "indexInBlock" : integer
    }
  ]
}

get user deposit history
/api/v3/user/withdrawals
accountId 	integer 	N 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	1
start 	integer 	N 	Start time in milliseconds
Default : 0L 	1578558098000
end 	integer 	N 	End time in milliseconds
Default : 0L 	1578558098000
status 	string 	N 	Comma separated status values
Allowable : ['processing', 'processed', 'received', 'failed'] 	"processing,p
rocessed"
limit 	integer 	N 	Number of records to return 	50
tokenSymbol 	string 	N 	Token to filter. If you want to return deposit records for all tokens, omit this parameter 	"LRC"
offset 	integer 	N 	Number of records to skip
Default : 0L 	1
withdrawalTypes 	string 	N 	request.getUserTxs.withdrawalTypes
Allowable : ['force_withdrawal', 'offchain_withdrawal'] 	"force_withdr
awal"
hashes 	string 	N 	The hashes (split by ,) of the transactions, normally its L2 tx hash, except the deposit which uses L1 tx hash. 	"0xf7c9323511
86c3a9053f31
3eefa16209c0
18f7f1dba8aa
8ca7100400f7
c31085"
{
  "totalNum" : 1,
  "transactions" : [
    {
      "id" : 1,
      "txType" : "FORCE_WITHDRAWAL",
      "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "symbol" : "LRC",
      "amount" : "1000000000000000000",
      "txHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "feeTokenSymbol" : "ETH",
      "feeAmount" : "1000000000000000",
      "status" : "processing",
      "progress" : "100%",
      "timestamp" : 1578572292000,
      "blockNum" : 100,
      "updatedAt" : 1578572292000,
      "distributeHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "requestId" : 1,
      "fastStatus" : "EMPTY",
      "blockId" : integer,
      "indexInBlock" : integer
    }
  ]
}

get user onchain withdrawal history
/api/v3/user/withdrawals
Get user onchain withdrawal history.
accountId 	integer 	N 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	1
start 	integer 	N 	Start time in milliseconds
Default : 0L 	1578558098000
end 	integer 	N 	End time in milliseconds
Default : 0L 	1578558098000
status 	string 	N 	Comma separated status values
Allowable : ['processing', 'processed', 'received', 'failed'] 	"processing,p
rocessed"
limit 	integer 	N 	Number of records to return 	50
tokenSymbol 	string 	N 	Token to filter. If you want to return deposit records for all tokens, omit this parameter 	"LRC"
offset 	integer 	N 	Number of records to skip
Default : 0L 	1
withdrawalTypes 	string 	N 	request.getUserTxs.withdrawalTypes
Allowable : ['force_withdrawal', 'offchain_withdrawal'] 	"force_withdr
awal"
hashes 	string 	N 	The hashes (split by ,) of the transactions, normally its L2 tx hash, except the deposit which uses L1 tx hash. 	"0xf7c9323511
86c3a9053f31
3eefa16209c0
18f7f1dba8aa
8ca7100400f7
c31085"
{
  "totalNum" : 1,
  "transactions" : [
    {
      "id" : 1,
      "txType" : "FORCE_WITHDRAWAL",
      "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "symbol" : "LRC",
      "amount" : "1000000000000000000",
      "txHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "feeTokenSymbol" : "ETH",
      "feeAmount" : "1000000000000000",
      "status" : "processing",
      "progress" : "100%",
      "timestamp" : 1578572292000,
      "blockNum" : 100,
      "updatedAt" : 1578572292000,
      "distributeHash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "requestId" : 1,
      "fastStatus" : "EMPTY",
      "blockId" : integer,
      "indexInBlock" : integer
    }
  ]
}

submit offchain withdraw request
POST
/api/v3/user/withdrawals
Submit offchain withdraw request
exchange 	string 	Y 	exchange address 	"1"
accountId 	integer 	Y 	account ID 	1003
owner 	string 	Y 	account owner address 	"0xbbbbca6a90
1c926f240b89
eacb641d8aec
7aeafd"
token 	Token
VolumeV3 	Y 	token to be withdrawal 	"{tokenId: 0, volume: 1000000}"
maxFee 	Token
VolumeV3 	Y 	maximum fee of withdrawal 	"{tokenId: 0, volume: 1000000}"
storageId 	integer 	Y 	offchain ID 	1
validUntil 	integer 	Y 	Timestamp for order to become invalid 	1519217383
minGas 	integer 	Y 	min gas for on-chain withdraw, Loopring exchange allocates gas for each distribution, but people can also assign this min gas, so Loopring have to allocate higher gas value for this specific distribution, 0 means let loopring choose the reasonable gas 	1519217383
to 	string 	Y 	withdraw to address 	"0x12345678"
extraData 	string 	N 	extra data for complex withdraw mode, normally none 	"0xABCD1234"
fastWithdrawalMode 	boolean 	N 	is fast withdraw mode 	"false"
eddsaSignature 	string 	N 	eddsa signature 	"0xccf0a141fc
e2dc5cbbd4f8
02c52220e9e2
ce260e86704d
6258603eb346
eefe2d4a4500
05c362b223b2
8402d087f706
5ea5eee03145
31adf6a580fc
e64c25dca81c
02"
ecdsaSignature 	string 	N 	ecdsa signature 	"0xeb14773e8a
07d19bc4fe56
e36d041dcb00
2652f7e92160
deaf5e6bf21e
05c7a9eb1477
3e8a07d19bc4
fe56e36d041d
cb002652f7e9
2160deaf5e6b
f21e05c7a9eb
14773e8a07d1
9bc4fe56e36d
041dcb002652
f7e92160deaf
5e6bf21e05c7
a9"
hashApproved 	string 	N 	An approved hash string which was already submitted on eth mainnet 	"0xf7c9323511
86c3a9053f31
3eefa16209c0
18f7f1dba8aa
8ca7100400f7
c31085"
{
  "hash" : "0x1d923ca7834dc90484fa2eb611f0f0bc7e741bb107007ebea19ba8caeab4f9d3",
  "status" : "received",
  "isIdempotent" : true
}

get user transfer list
/api/v3/user/transfers
Get user transfer list.
accountId 	integer 	N 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	1
start 	integer 	N 	Start time in milliseconds
Default : 0L 	1578558098000
end 	integer 	N 	End time in milliseconds
Default : 0L 	1578558098000
status 	string 	N 	Comma separated status values
Allowable : ['processing', 'processed', 'received', 'failed'] 	"processing,p
rocessed"
limit 	integer 	N 	Number of records to return 	50
tokenSymbol 	string 	N 	Token to filter. If you want to return deposit records for all tokens, omit this parameter 	"LRC"
offset 	integer 	N 	Number of records to skip
Default : 0L 	1
transferTypes 	string 	N 	transfer types, inlcude transfer, transfer_red, etc 	"transfer, transfer_red"
hashes 	string 	N 	The hashes (split by ,) of the transactions, normally its L2 tx hash, except the deposit which uses L1 tx hash. 	"0xf7c9323511
86c3a9053f31
3eefa16209c0
18f7f1dba8aa
8ca7100400f7
c31085"
{
  "totalNum" : 1,
  "transactions" : [
    {
      "id" : 1,
      "hash" : "0x9d114267e8b261457d567093c13cf3deea5f14c9235be26c6fa833dba12a9632",
      "txType" : "transfer",
      "symbol" : "LRC",
      "amount" : "1000000000000000000",
      "senderAddress" : "0x0306b9d5c9Ed358FC7b77780bACD15398D242f26",
      "receiver" : 1,
      "receiverAddress" : "0x0306b9d5c9Ed358FC7b77780bACD15398D242f26",
      "feeTokenSymbol" : "ETH",
      "feeAmount" : "1000000000000000",
      "status" : "processing",
      "progress" : "100%",
      "timestamp" : 1578572292000,
      "updatedAt" : 1578572292000,
      "memo" : "Air Drop",
      "blockId" : integer,
      "indexInBlock" : integer
    }
  ]
}

get user trade history
/api/v3/user/trades
Get user trade history.
accountId 	integer 	Y 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	1
market 	string 	N 	Trading pair 	"LRC-ETH"
orderHash 	string 	N 	Order hash 	"0x9d114267e8
b261457d5670
93c13cf3deea
5f14c9235be2
6c6fa833dba1
2a9632"
offset 	integer 	N 	Number of records to skip 	1
limit 	integer 	N 	Number of records to return 	50
fromId 	integer 	N 	The begin id of the query 	1
fillTypes 	string 	N 	request.getUserTxs.fillTypes
Allowable : ['dex', 'amm'] 	"dex"
{
  "totalNum" : 100,
  "trades" : [["0","0","BUY","0","0","LRC-USDT","0"]]
}

query user place order fee rate
/api/v3/user/orderFee
Returns the fee rate of users placing orders in specific markets
accountId 	integer 	Y 	Account ID 	1
market 	string 	Y 	List of markets to be queried separated by "," 	"LRC-ETH"
tokenB 	integer 	Y 	Token ID 	0
amountB 	string 	Y 	Amount to buy 	"100000000000
00000"
{
  "feeRate" : {
    "symbol" : "LRC-USDT",
    "makerRate" : 20,
    "takerRate" : 20
  },
  "gasPrice" : "10000000000"
}

query current token minimum amount
/api/v3/user/orderUserRateAmount
This API returns 2 minimum amounts, one is based on users fee rate, the other is based on the maximum fee bips which is 0.6%. In other words, if user wants to keep fee rate, the minimum order is higher, otherwise he needs to pay more but can place less amount orders.
accountId 	integer 	Y 	Account ID, some hash query APIs doesnt need it if in hash query mode, check require flag of each API to see if its a must. 	10086
market 	string 	Y 	Trading pair 	"LRC-ETH"
{
  "gasPrice" : "10000000000",
  "amounts" : [
    {
      "tokenSymbol" : "LRC",
      "discount" : 1.0,
      "baseOrderInfo" : {
        "minAmount" : "10000000000",
        "makerRate" : 0,
        "takerRate" : 0
      },
      "userOrderInfo" : {
        "minAmount" : "10000000000",
        "makerRate" : 0,
        "takerRate" : 0
      }
    }
  ],
  "cacheOverdueAt" : 1614683483382
}

query current fee amount
/api/v3/user/offchainFee
Returns the fee amount
accountId 	integer 	Y 	Account ID 	0
requestType 	integer 	Y 	Off-chain request type
Allowable : ['0:ORDER', '1:OFFCHAIN_WITHDRAWAL', '2:UPDATE_ACCOUNT', '3:TRANSFER', '4:FAST_OFFCHAIN_WITHDRAWAL', '5:OPEN_ACCOUNT', '6:AMM_EXIT', '7:DEPOSIT', '8:AMM_JOIN'] 	1
tokenSymbol 	string 	N 	The token to withdraw 	"LRC"
amount 	string 	N 	The amount to withdraw 	"10000000000"
{
  "token" : "ETH",
  "fee" : "2000000000000000",
  "discount" : 1.0
}

get AMM pool configurations
/api/v3/amm/pools
Returns the configurations of all supported AMM pools
{
  "pools" : [
    {
      "name" : "LRC-USDT-Pool-1",
      "market" : "AMM-LRC-USDT",
      "address" : "0xa6fa83b62b09174694EFD7EE3aE608ad478a138E",
      "version" : "1.0.0",
      "tokens" : {
        "pooled" : [2,3,5],
        "lp" : 0
      },
      "feeBips" : 6,
      "precisions" : {
        "price" : 6,
        "amount" : 6
      },
      "createdAt" : "1609466400000",
      "status" : 7
    }
  ]
}

get AMM pool balance snapshot
/api/v3/amm/balance
Returns the snapshot of specific AMM pool
poolAddress 	string 	Y 	input AMM pool address 	"0xbbbbca6a90
1c926f240b89
eacb641d8aec
7aeafd"
{
  "poolName" : "AMM-LRC-ETH",
  "poolAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
  "pooled" : [{tokenId: 0, volume:1000000000}, {tokenId: 1, volume:1000000000}],
  "lp" : {
    "tokenId" : 0,
    "volume" : "1000000000000"
  },
  "risky" : false
}

join into AMM pool
/api/v3/amm/join
Return the join request processing status
owner 	string 	Y 	The account owner adderss 	"0xe25c94ba03
6d91b48833ac
b637f719038f
07372d"
poolAddress 	string 	Y 	AMM pool address to be joined 	"0xe25c94ba03
6d91b48833ac
b637f719038f
07372d"
joinTokens 	AmmPool
Join
Tokens 	Y 	Token amounts to be joined and the minimum mint token to be paied back 	"{"pooled": [{"id": 0,"amount": 0}],"minimum
Lp": 0}"
storageIds 	string 	Y 	Offchain request storage Id 	"1"
fee 	string 	Y 	fee of join request 	"100000000000
0000000"
validUntil 	integer 	Y 	Timestamp for order to become invalid 	1598431481
eddsaSignature 	string 	N 	AMM join request eddsa signature 	"0xccf0a141fc
e2dc5cbbd4f8
02c52220e9e2
ce260e86704d
6258603eb346
eefe2d4a4500
05c362b223b2
8402d087f706
5ea5eee03145
31adf6a580fc
e64c25dca81c
02"
ecdsaSignature 	string 	N 	AMM join request ecdsa signature 	"0xeb14773e8a
07d19bc4fe56
e36d041dcb00
2652f7e92160
deaf5e6bf21e
05c7a9eb1477
3e8a07d19bc4
fe56e36d041d
cb002652f7e9
2160deaf5e6b
f21e05c7a9eb
14773e8a07d1
9bc4fe56e36d
041dcb002652
f7e92160deaf
5e6bf21e05c7
a9"
{
  "hash" : "0x1d923ca7834dc90484fa2eb611f0f0bc7e741bb107007ebea19ba8caeab4f9d3",
  "status" : "received",
  "isIdempotent" : true
}

exit an AMM pool
POST
/api/v3/amm/exit
Return the exit request processing status
owner 	string 	Y 	The account owner adderss 	"0xe25c94ba03
6d91b48833ac
b637f719038f
07372d"
poolAddress 	string 	Y 	AMM pool address to be joined 	"0xe25c94ba03
6d91b48833ac
b637f719038f
07372d"
exitTokens 	AmmPool
Exit
Tokens 	Y 	Exit token amounts, include mint token to burn and the minimum exit tokens to be get back 	"{"burned": 0,"unpooled"
: [{"id": 0,"amount": 0}]}"
storageId 	integer 	Y 	Offchain request storage Id 	1
maxFee 	string 	Y 	Maximum fee of exit request, use the last in pool token by default 	"100000000000
0000000"
validUntil 	integer 	Y 	Timestamp for order to become invalid 	1598431481
eddsaSignature 	string 	N 	AMM exit request eddsa signature 	"0xccf0a141fc
e2dc5cbbd4f8
02c52220e9e2
ce260e86704d
6258603eb346
eefe2d4a4500
05c362b223b2
8402d087f706
5ea5eee03145
31adf6a580fc
e64c25dca81c
02"
ecdsaSignature 	string 	N 	AMM exit request ecdsa signature 	"0xeb14773e8a
07d19bc4fe56
e36d041dcb00
2652f7e92160
deaf5e6bf21e
05c7a9eb1477
3e8a07d19bc4
fe56e36d041d
cb002652f7e9
2160deaf5e6b
f21e05c7a9eb
14773e8a07d1
9bc4fe56e36d
041dcb002652
f7e92160deaf
5e6bf21e05c7
a9"
{
  "hash" : "0x1d923ca7834dc90484fa2eb611f0f0bc7e741bb107007ebea19ba8caeab4f9d3",
  "status" : "received",
  "isIdempotent" : true
}

user's AMM join/exit transactions
/api/v3/amm/user/transactions
Return the user's AMM join/exit transactions
accountId 	integer 	N 	Looprings account identifier. 	1578558098000
start 	integer 	N 	Date from which to start fetching AMM transactions. 	1578558098000
end 	integer 	N 	End Date of the query 	1578558098000
limit 	integer 	N 	Used to limit the number of returned records. Useful in implementing pagination. 	50
offset 	integer 	N 	Used to apply an offset when looking for valid records. Useful in implementing 	0
txTypes 	string 	N 	Transaction type: join or exit 	"0"
txStatus 	string 	N 	The AMM transaction status. 	"0"
ammPoolAddress 	string 	N 	The address of the pool on which the swap was submitted. 	"0"
{
  "totalNum" : 10,
  "transactions" : [
    {
      "hash" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
      "txType" : "join",
      "txStatus" : "processing",
      "ammPoolAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
      "ammLayerType" : "layer_2",
      "poolTokens" : [
        {
          "tokenId" : 0,
          "amount" : "1000000",
          "actualAmount" : "100000",
          "feeAmount" : "500000"
        }
      ],
      "lpToken" : {
        "tokenId" : 0,
        "amount" : "1000000",
        "actualAmount" : "100000",
        "feeAmount" : "500000"
      },
      "createdAt" : 1608189538074,
      "updatedAt" : 1608209538074,
      "blockId" : integer,
      "indexInBlock" : integer
    }
  ]
}

get AMM pool trade transactions
/api/v3/amm/trades
get AMM pool trade transactions
ammPoolAddress 	string 	Y 	The address of the pool on which the swap was submitted. 	"0xbbbbca6a90
1c926f240b89
eacb641d8aec
7aeafd"
limit 	integer 	N 	Used to limit the number of returned records. Useful in implementing pagination. 	50
offset 	integer 	N 	Used to apply an offset when looking for valid records. Useful in implementing 	0
{
  "totalNum" : 12345,
  "trades" : [
    {
      "accountId" : 12345,
      "orderHash" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
      "market" : "AMM-DAI-ETH",
      "side" : "BUY",
      "size" : "100000000",
      "price" : 0.03,
      "feeAmount" : "100000000",
      "createdAt" : 1608189538074
    }
  ]
}

get L2 block info
/api/v3/block/getBlock
Get L2 block info by block id
id 	string 	N 	The block id, could be finalized, confirmed, or block_idx_num
Default : finalized
Allowable : ['finalized', 'confirmed', '{block_idx_num}'] 	"1234"
{
  "blockId" : 1235,
  "blockSize" : 64,
  "exchange" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
  "txHash" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
  "status" : "pending",
  "createdAt" : 1627904776000,
  "transactions" : [
    {
      "txType" : "transfer",
      "accountId" : 10006,
      "owner" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
      "token" : {
        "tokenId" : 6,
        "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
        "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "amount" : "100"
      },
      "toToken" : {
        "tokenId" : 6,
        "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
        "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "amount" : "100"
      },
      "fee" : {
        "tokenId" : 6,
        "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
        "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "amount" : "100"
      },
      "validUntil" : 1627904776,
      "toAccountId" : 10006,
      "toAccountAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
      "storageId" : 2,
      "orderA" : {
        "storageID" : 6,
        "accountID" : 10006,
        "amountS" : "100",
        "amountB" : "600",
        "tokenS" : 6,
        "tokenB" : 32768,
        "validUntil" : 1235123512,
        "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "feeBips" : 60,
        "isAmm" : true,
        "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "fillS" : 500
      },
      "orderB" : {
        "storageID" : 6,
        "accountID" : 10006,
        "amountS" : "100",
        "amountB" : "600",
        "tokenS" : 6,
        "tokenB" : 32768,
        "validUntil" : 1235123512,
        "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "feeBips" : 60,
        "isAmm" : true,
        "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "fillS" : 500
      },
      "valid" : false,
      "nonce" : 65,
      "minterAccountId" : 10008,
      "minter" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
      "nftToken" : {
        "tokenId" : 6,
        "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
        "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
        "amount" : "100"
      },
      "nftType" : "eip1155"
    }
  ]
}

get pending txs
/api/v3/block/getPendingRequests
Get pending txs to be packed into next block
{
  "txType" : "transfer",
  "accountId" : 10006,
  "owner" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
  "token" : {
    "tokenId" : 6,
    "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
    "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "amount" : "100"
  },
  "toToken" : {
    "tokenId" : 6,
    "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
    "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "amount" : "100"
  },
  "fee" : {
    "tokenId" : 6,
    "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
    "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "amount" : "100"
  },
  "validUntil" : 1627904776,
  "toAccountId" : 10006,
  "toAccountAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
  "storageId" : 2,
  "orderA" : {
    "storageID" : 6,
    "accountID" : 10006,
    "amountS" : "100",
    "amountB" : "600",
    "tokenS" : 6,
    "tokenB" : 32768,
    "validUntil" : 1235123512,
    "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "feeBips" : 60,
    "isAmm" : true,
    "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "fillS" : 500
  },
  "orderB" : {
    "storageID" : 6,
    "accountID" : 10006,
    "amountS" : "100",
    "amountB" : "600",
    "tokenS" : 6,
    "tokenB" : 32768,
    "validUntil" : 1235123512,
    "taker" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "feeBips" : 60,
    "isAmm" : true,
    "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "fillS" : 500
  },
  "valid" : false,
  "nonce" : 65,
  "minterAccountId" : 10008,
  "minter" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
  "nftToken" : {
    "tokenId" : 6,
    "tokenAddress" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
    "nftData" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "nftId" : "0xf7c932351186c3a9053f313eefa16209c018f7f1dba8aa8ca7100400f7c31085",
    "amount" : "100"
  },
  "nftType" : "eip1155"
}





































  // get server timestamp
  async timestamp() {}
  // get api key
  async getKey() {}
  // update api key
  async updateKey() {}
  // get next storage id
  async getStorageId() {}
  // get order details
  async getOrder() {}
  // submit an order
  async submitOrder() {}
  // cancel order
  async cancelOrder() {}
  // get multiple orders
  async getOrders() {}
  // get market configurations
  async getMarketInfo() {}
  // get token configurations
  async getTokenInfo() {}
  // get exchange configurations
  async getExchangeInfo() {}
  // get market orderbook
  async getDepth() {}
  // get market ticker
  async getTicker() {}
  // get market candlestick
  async getCandlestick() {}
  // get token fiat prices
  async getFiatPrice() {}
  // get market recent trades
  async trade() {}
  // submit internal transfer
  async transfer() {}
  // query user information
  async getAccount() {}
  // update account eddsa key
  async updateAccount() {}
  // get user registration transactions
  async getUserTx() {}
  // get password reset transactions
  async getPasswordTx() {}
  // get user exchange balances
  async getUserBalances() {}
  // get user deposit history
  async getUserDeposits() {}
  // get user onchain withdrawal history
  async getWithdrawals() {}
  // submit offchain withdraw request
  async withdraw() {}
  // get user transfer list
  async getTransfers() {}
  // get user trade history
  async getTrades() {}
  // query current token minimum amount
  async getOrderFee() {}
  // query user place order fee rate
  async getRate() {}
  // query current fee amount
  async getCurrentFee() {}
  // get AMM pool configurations
  async getAMM_Config() {}
  // get AMM pool balance snapshot
  async getAMM_Snapshot() {}
  // join into AMM pool
  async joinAMM() {}
  // exit an AMM pool
  async exitAMM() {}
  // user's AMM join/exit transactions
  async getAMM_Tx() {}
  // get AMM pool trade transactions
  async getAMM_Trades() {}
  // get L2 block info
  async getBlock() {}
  // get pending txs
  async getPendingRequests() {}