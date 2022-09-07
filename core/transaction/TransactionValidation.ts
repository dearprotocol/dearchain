// Validate Transaction

import BigNumber from "bignumber.js";
import { randomBytes, createHash, sign } from "crypto";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { PRIVATE_KEY } from "../../Constant";
import { RawTransaction } from "../../interfaces/Transaction";
import {
  convertTo64BaseBuffer,
  convertToHex,
  getAddress,
} from "../../packages/address/external";
import { AddressDB } from "../../packages/db/memory/address";
// 122 + 2 + DATA
const SignedTransactionData =
  "dd706df2495a07d09c68e67438b6fd0d3c6dc118757b5d93556136a627a91ae42bc7753ecd70e79d1e8b8fbfa2cd00fc41df88d3333c65abf562b67c802ef292007b226e6f6e6365223a2230222c22666565734f666665726564223a302e30322c2266726f6d223a226637383762373436393864643430313665646563383561393238343561373439366637343233613861656664646337303064313164643462222c2274797065223a225452414e53464552222c22746f6b656e5472616e73666572223a5b7b22746f6b656e4964223a2244454152222c22616d6f756e74223a352c22746f223a223461363830353037313430306166643365363164383266663962313133626233363733366239663332316364313036613466376235373130227d5d2c22657874726144617461223a22227d";

const calculateHash = (data: string): string => {
  const hash = new SHA3(256);
  hash.update(data);
  let txn = hash.digest("hex");
  console.log("Hash", txn);
  return txn;
};

export const isValid = (signedData: string) => {
  if (signedData.length > 130) {
    let signature = signedData.slice(0, 128);
    let recId = signedData.slice(128, 130);
    let txData = signedData.slice(130, signedData.length);
    // console.log(signature,recId,txData);
    let transaction = JSON.parse(Buffer.from(txData, "hex").toString("ascii"));
    console.log(transaction);
    // let balance = getBalance(transaction.from)
   const  type = transaction.type;
   console.log(type)
    if (validateSignature(transaction, txData, signature, recId)) {
      if (feesCheckBalance(transaction)) {
        console.log("Check");
        switch (type) {
          case "TRANSFER":
            validateTransfer(transaction);
            console.log("Transaction Successfully Added");
            break;
        }
      }
    }
  }
};

function validateTransfer(txn: RawTransaction) {
//   console.log("Hii");
  txn.tokenTransfer?.forEach((token, i) => {
    console.log(
      "Balance Available:",
      validateBalance(txn.from, token.tokenId, token.amount)
    );
  });
}

function validateBalance(address: string, asset: string, required: number) {
  if (
    AddressDB[address]?.balance[asset] != undefined &&
    BigNumber(AddressDB[address].balance[asset]).isGreaterThanOrEqualTo(
      BigNumber(required)
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function validateSignature(
  transaction: RawTransaction,
  txData: string,
  signature: string,
  recId: string
) {
  let txid = calculateHash(txData);
  let recoveredPublicKey = secp256k1.ecdsaRecover(
    Buffer.from(signature, "hex"),
    parseInt(recId, 16),
    Buffer.from(txid, "hex")
  );
  let address = getAddress(convertToHex(recoveredPublicKey));
  console.log(
    secp256k1.ecdsaVerify(
      Buffer.from(signature, "hex"),
      Buffer.from(txid, "hex"),
      secp256k1.publicKeyCreate(Buffer.from(PRIVATE_KEY, "hex"))
    )
  );
  console.log("Addr", convertToHex(address));

  return address;
}

function feesCheckBalance(txn: RawTransaction) {
  let fees;
  txn.tokenTransfer?.forEach((token, i) => {

    // console.log(token.amount)
    // console.log(txn.feesOffered)
    // console.log(AddressDB[txn.from]?.balance[token.tokenId])
    if (token.tokenId == "DEAR") {
      if (
        BigNumber(token.amount)
          .plus(txn.feesOffered)
          .isLessThanOrEqualTo(
            BigNumber(AddressDB[txn.from]?.balance[token.tokenId])
          )
      ) {
        fees = BigNumber(token.amount).plus(txn.feesOffered);
        // console.log(fees)
        return true;
      } else {
        return false;
      }
    }
  });

  return fees;
}

isValid(SignedTransactionData);
