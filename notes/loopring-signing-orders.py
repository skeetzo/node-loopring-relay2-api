



Signing Orders

You need to seralized specific fields of an order into an integer array, 
then calculate the Poseidon hash of the array, and then sign the hash with your EdDSA private key.

The rules for serialization of orders, hashing, and signature methods must 
strictly follow Looprings Specification.

Below we use Python code as a demo:

class EddsaSignHelper:
    def __init__(self, poseidon_params, private_key):
        self.poseidon_sign_param = poseidon_params
        self.private_key = private_key
        # print(f"self.private_key = {self.private_key}")

    def hash(self, structure_data):
        serialized_data = self.serialize_data(structure_data)
        msgHash = poseidon(serialized_data, self.poseidon_sign_param)
        return msgHash

    def sign(self, structure_data):
        msgHash = self.hash(structure_data)
        signedMessage = PoseidonEdDSA.sign(msgHash, FQ(int(self.private_key, 16)))
        return "0x" + "".join([
                        hex(int(signedMessage.sig.R.x))[2:].zfill(64),
                        hex(int(signedMessage.sig.R.y))[2:].zfill(64),
                        hex(int(signedMessage.sig.s))[2:].zfill(64)
                    ])

class OrderEddsaSignHelper(EddsaSignHelper):
    def __init__(self, private_key):
        super(OrderEddsaSignHelper, self).__init__(
            poseidon_params(SNARK_SCALAR_FIELD, 12, 6, 53, b'poseidon', 5, security_target=128),
            private_key
        )

    def serialize_data(self, order):
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





































Signing Off-chain Withdrawals

Following structure shows a offchain withdrawal request:

    {
        "exchange": "0x35990C74eB567B3bbEfD2Aa480467b1031b23eD9",
        "accountId": 5,
        "owner": "0x23a51c5f860527f971d0587d130c64536256040d",
        "token": {
            "tokenId": 0,
            "volume": str(1000000000000000000),
        },
        "maxFee" : {
            "tokenId": 0,
            "volume": str(1000000000000000),
        },
        "to": "0xc0ff3f78529ab90f765406f7234ce0f2b1ed69ee",
        "onChainDataHash": "0x" + bytes.hex(onchainDataHash),
        "storageId": 5,
        "validUntil" : 0xfffffff,
        "minGas": 300000,
        "extraData": bytes.hex(extraData)
    }

The code for signing it in Python is as follows. Just like the order, the only difference 
is the request itself, so we just adjust params which calculate the poseidon hash.

class WithdrawalEddsaSignHelper(EddsaSignHelper):
    def __init__(self, private_key):
        super(WithdrawalEddsaSignHelper, self).__init__(
            poseidon_params(SNARK_SCALAR_FIELD, 10, 6, 53, b'poseidon', 5, security_target=128),
            private_key
        )

    def serialize_data(self, withdraw):
        return [
            int(withdraw['exchange'], 16),
            int(withdraw['accountId']),
            int(withdraw['token']['tokenId']),
            int(withdraw['token']['volume']),
            int(withdraw['maxFee']['tokenId']),
            int(withdraw['maxFee']['volume']),
            int(withdraw['onChainDataHash'], 16),
            int(withdraw['validUntil']),
            int(withdraw['storageId']),
        ]





















Signing Internal Transfer

You need to seralized specific fields of an transfer into an integer array, 
then calculate the Poseidon hash of the array, and then sign the hash with your EdDSA private key.

The following is an example of internal transfers:

    {
        "exchange": "0x35990C74eB567B3bbEfD2Aa480467b1031b23eD9",
        "payerId": 0,
        "payerAddr": "0x611db73454c27e07281d2317aa088f9918321415",
        "payeeId": 0,
        "payeeAddr": "0xc0ff3f78529ab90f765406f7234ce0f2b1ed69ee",
        "token": {
            "tokenId": 0,
            "volume": str(1000000000000000000),
        },
        "maxFee" : {
            "tokenId": 0,
            "volume": str(1000000000000000),
        },
        "storageId": 1,
        "validUntil": 0xfffffff
    }

where storageId must start from 1 and increment by 2.

The code for signing it in Python is as follows:

class OriginTransferEddsaSignHelper(EddsaSignHelper):
    def __init__(self, private_key):
        super(OriginTransferEddsaSignHelper, self).__init__(
            poseidon_params(SNARK_SCALAR_FIELD, 13, 6, 53, b'poseidon', 5, security_target=128),
            private_key
        )

    def serialize_data(self, originTransfer):
        return [
            int(originTransfer['exchange'], 16),
            int(originTransfer['payerId']),
            int(originTransfer['payeeId']), # payer_toAccountID
            int(originTransfer['token']['tokenId']),
            int(originTransfer['token']['volume']),
            int(originTransfer['maxFee']['tokenId']),
            int(originTransfer['maxFee']['volume']),
            int(originTransfer['payeeAddr'], 16), # payer_to
            0, #int(originTransfer.get('dualAuthKeyX', '0'),16),
            0, #int(originTransfer.get('dualAuthKeyY', '0'),16),
            int(originTransfer['validUntil']),
            int(originTransfer['storageId'])
        ]












































Extra ECDSA authentic in header

As the above table shows, some requests need extra authentic in request header.

Listed as below:
Request     EDDSA   ECDSA   Approved Hash   X-API-SIG in header
submitTransfer  Y   Optional    Y   EIP712 signed structure
submitOffchainWithdraw  Y   Optional    Y   EIP712 signed structure
updateAccount   Y   Y   Y   EIP712 signed structure

So, If a user wants to do submitTransfer, submitOffchainWithdraw and updateAccount, 
in addition to EDSSA signature, you also need to use ECDSA to sign them and put the 
signature in request header. Loopring 3.6 uses the EIP712 standard, A user need to 
serialize specific fields of an request, say transfer into a EIP712 compatible structure, 
and then use standard EIP712 hash algorithm to calculate the hash of the structure, 
and then, use personal _sign to sign the combined string.

The code for EIP712 signing it in python is as follows:

def createOriginTransferMessage(req: dict):
    class Transfer(EIP712Struct):
        pass

    setattr(Transfer, 'from', Address())
    Transfer.to           = Address()
    Transfer.tokenID      = Uint(16)
    Transfer.amount       = Uint(96)
    Transfer.feeTokenID   = Uint(16)
    Transfer.maxFee       = Uint(96)
    Transfer.validUntil   = Uint(32)
    Transfer.storageID    = Uint(32)

    transfer = Transfer(**{
        "from"          : req['payerAddr'],
        "to"            : req['payeeAddr'],
        "tokenID"       : req['token']['tokenId'],
        "amount"        : int(req['token']['volume']),
        "feeTokenID"    : req['maxFee']['tokenId'],
        "maxFee"        : int(req['maxFee']['volume']),
        "validUntil"    : req['validUntil'],
        "storageID"     : req['storageId']
    })

    # print(f"transfer type hash = {bytes.hex(transfer.type_hash())}")
    return EIP712.hash_packed(
        EIP712.exchangeDomain.hash_struct(),
        transfer.hash_struct()
    )

message = createUpdateAccountMessage(transfer_request)
v, r, s = sig_utils.ecsign(message, self.ecdsaKey)

The EIP712 structure declarations of each requests types can be found in Loopring contract, or 
just get it from our reference code base. Below are withdrawal request EIP712 structure.

    struct Withdrawal
    {
        address owner;
        uint32  accountID;
        uint16  tokenID;
        uint    amount;
        uint16  feeTokenID;
        uint    fee;
        address to;
        bytes32 extraDataHash;
        uint    minGas;
        uint32  validUntil;
        uint32  storageID;
    }

So the signing logic is:

def createOffchainWithdrawalMessage(req: dict):
    class Withdrawal(EIP712Struct):
        owner = Address()
        accountID = Uint(32)
        tokenID = Uint(16)
        amount = Uint(96)
        feeTokenID = Uint(16)
        maxFee = Uint(96)
        to = Address()
        extraData = Bytes()
        minGas = Uint()
        validUntil = Uint(32)
        storageID = Uint(32)

    # "Withdrawal(address owner,uint32 accountID,uint16 tokenID,uint96 amount,uint16 feeTokenID,uint96 maxFee,address to,bytes extraData,uint256 minGas,uint32 validUntil,uint32 storageID)"
    withdrawal = Withdrawal(**{
        "owner"         : req['owner'],
        "accountID"     : req['accountId'],
        "tokenID"       : req['token']['tokenId'],
        "amount"        : int(req['token']['volume']),
        "feeTokenID"    : req['maxFee']['tokenId'],
        "maxFee"        : int(req['maxFee']['volume']),
        "to"            : req['to'],
        "extraData"     : bytes.fromhex(req['extraData']),
        "minGas"        : int(req['minGas']),
        "validUntil"    : req['validUntil'],
        "storageID"     : req['storageId'],
    })

    # print(f"extraData hash = {bytes.hex(Web3.keccak(bytes.fromhex(req['extraData'])))}")
    # print(f"withdrawal type hash = {bytes.hex(withdrawal.type_hash())}")
    return EIP712.hash_packed(
        EIP712.exchangeDomain.hash_struct(),
        withdrawal.hash_struct()
    )

message = createUpdateAccountMessage(withdrawal_request)
v, r, s = sig_utils.ecsign(message, self.ecdsaKey)

Please NOTE: The final string in request header is a 134 bytes hex string which is constructed as below code shows:

    v, r, s = sig_utils.ecsign(message, self.ecdsaKey)
    header['X-API-SIG'] = "0x" + bytes.hex(v_r_s_to_signature(v, r, s)) + "02"

It starts with '0x' to indicate hex format and ends with '02' which stands 
for EIP_712 signature type. Forget to add '02' type leads to signature verification 
failure as Relay has no hint on the way of verifiction.