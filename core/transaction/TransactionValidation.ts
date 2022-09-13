// Validate Transaction

import BigNumber from "bignumber.js";
import { randomBytes, createHash, sign } from "crypto";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { PRIVATE_KEY1 } from "../../Constant";
import { RawTransaction } from "../../interfaces/Transaction";
import { updatebalance } from "../transaction/UpdateTransaction";
import {
  convertTo64BaseBuffer,
  convertToHex,
  getAddress,
} from "../../packages/address/external";
import { AddressDB } from "../../packages/db/memory/address";
import { emitWss } from "../../p2p/emit";
import { TransactionPoolDB } from "../../packages/db/memory/transactionpool";
// 122 + 2 + DATA
// const SignedTransactionData = //for other token testing
//   "1590304ebe4cff85a15635579fc062a25bf2826db283749207a8015d4593fdb96d70b23c07ed9a15ad59a3f8466e9552689cb9212e83fa473372d1507831b605017b226e6f6e6365223a2230222c22666565734f666665726564223a302e30322c2266726f6d223a226637383762373436393864643430313665646563383561393238343561373439366637343233613861656664646337303064313164643462222c2274797065223a225452414e53464552222c22746f6b656e5472616e73666572223a5b7b22746f6b656e4964223a2255534454222c22616d6f756e74223a352c22746f223a226337656635666433303039663030313963313737663362333838383365656635386565333035373232326631633764326131393464656435227d5d2c22657874726144617461223a22227d";
const SignedTransactionData: string[] = [
  "dd706df2495a07d09c68e67438b6fd0d3c6dc118757b5d93556136a627a91ae42bc7753ecd70e79d1e8b8fbfa2cd00fc41df88d3333c65abf562b67c802ef292007b226e6f6e6365223a2230222c22666565734f666665726564223a302e30322c2266726f6d223a226637383762373436393864643430313665646563383561393238343561373439366637343233613861656664646337303064313164643462222c2274797065223a225452414e53464552222c22746f6b656e5472616e73666572223a5b7b22746f6b656e4964223a2244454152222c22616d6f756e74223a352c22746f223a223461363830353037313430306166643365363164383266663962313133626233363733366239663332316364313036613466376235373130227d5d2c22657874726144617461223a22227d",
  "1590304ebe4cff85a15635579fc062a25bf2826db283749207a8015d4593fdb96d70b23c07ed9a15ad59a3f8466e9552689cb9212e83fa473372d1507831b605017b226e6f6e6365223a2230222c22666565734f666665726564223a302e30322c2266726f6d223a226637383762373436393864643430313665646563383561393238343561373439366637343233613861656664646337303064313164643462222c2274797065223a225452414e53464552222c22746f6b656e5472616e73666572223a5b7b22746f6b656e4964223a2255534454222c22616d6f756e74223a352c22746f223a226337656635666433303039663030313963313737663362333838383365656635386565333035373232326631633764326131393464656435227d5d2c22657874726144617461223a22227d",
];

const calculateHash = (data: string): string => {
  const hash = new SHA3(256);
  hash.update(data);
  let txn = hash.digest("hex");
  // console.log("Hash", txn);
  return txn;
};

export const isValidTransaction = (signedData: string) => {
  if (signedData.length > 130) {
    let signature = signedData.slice(0, 128);
    let recId = signedData.slice(128, 130);
    let txData = signedData.slice(130, signedData.length);

    let transaction: RawTransaction = JSON.parse(
      Buffer.from(txData, "hex").toString("ascii")
    );
    const type = transaction.type;
    if (validateSignature(transaction, txData, signature, recId)) {
      //&& validateTransfer(transaction)

      if (feesCheckBalance(transaction) && validateTransfer(transaction)) {
        switch (type) {
          case "TRANSFER":
            // updateTransfer(transaction, txData,signedData);

            //memory db transaction storage
            // updateState include txn id and transaction status
            //nonce +1
            // console.log("Transaction Successfully Validated");
            break;
        }
        return true;
      }
    }
    return false;
  }
};

export function validateTransfer(txn: RawTransaction) {
  //   console.log("Hii");

  let val;
  txn.tokenTransfer?.forEach((token, i) => {
    // console.log(
    //   "Balance Available:",
    //   validateBalance(txn.from, token.tokenId, token.amount)
    // );
    val = validateBalance(txn.from, token.tokenId, token.amount);
  });

  return val;
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

export function validateSignature(
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


  return address;
}

function feesCheckBalance(txn: RawTransaction) {
  let fees;
  txn.tokenTransfer?.forEach((token, i) => {
    // console.log(AddressDB[txn.from]?.balance[token.tokenId])
    // if (
    //   token.tokenId == "DEAR" &&
    //   AddressDB[txn.from]?.balance[token.tokenId] != undefined
    // ) {
    if (
      token.tokenId == "USDT" ||
      (token.tokenId == "DEAR" &&
        AddressDB[txn.from]?.balance[token.tokenId] != undefined)
    ) {
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

function updateTransfer(
  transaction: RawTransaction,
  txData: string,
  signedData: string
) {
  // const fs = require("fs");
  if (txData != undefined) {
    const txid = calculateHash(txData);

    // console.log("transactions ", transaction);
    transaction.tokenTransfer?.forEach((token, i) => {
      let nonce = 1;
      const totalAmount = BigNumber(token.amount);
      const fees = transaction.feesOffered;
      const tokenID = token.tokenId;
      const newBalance = BigNumber(
        AddressDB[transaction.from].balance[token.tokenId]
      ).minus(totalAmount);

      const address = transaction.from;

      updatebalance(address, newBalance, tokenID, true, fees); ///

      const toAddress = token.to;
      let toBalance = BigNumber(token.amount);

      // console.log(token.to);
      if (
        AddressDB[token.tokenId] &&
        AddressDB[token.to].balance[token.tokenId] != undefined
      ) {
        toBalance = BigNumber(AddressDB[token.to].balance[token.tokenId]).plus(
          toBalance
        );
      }

      // updatebalance(toAddress, toBalance, "DEAR", true);

      const transferComplete = true;
    });
    // console.log("id", transaction);
    emitWss(
      JSON.stringify({
        event_name: "transaction submitted",
        transactionHash: txid,
      })
    );

    // console.log("addDB", AddressDB);

    TransactionPoolDB.txData[txid] = signedData;
    // console.log("txpoolDB",TransactionPoolDB);
  }

  //   if (transferComplete) {
  //     let txn = {
  //       txid: txid,
  //       nonce: nonce,
  //       fromAddress: address,
  //       toAddress: to,
  //       totalAmount: amount,
  //       fees: fees,
  //     };

  //      const newTxn = JSON.stringify(txn);
  //      fs.writeFile('transaction.json', newTxn, (err: any) => {
  //       // error checking
  //       if(err) throw err;

  //       // console.log("New data added");
  //   });
  // }
}

function processTransaction(signedData: string[]) {
  //for Multiple Transaction
  if (signedData != null) {
    for (let i in signedData) {
      if (signedData[i].length > 130) {
        let signature = signedData[i].slice(0, 128);
        let recId = signedData[i].slice(128, 130);
        let txData = signedData[i].slice(130, signedData[i].length);
        let transaction: RawTransaction = JSON.parse(
          Buffer.from(txData, "hex").toString("ascii")
        );
        const type = transaction.type;

        if (validateSignature(transaction, txData, signature, recId)) {
          if (feesCheckBalance(transaction) && validateTransfer(transaction)) {
            switch (type) {
              case "TRANSFER":
                updateTransfer(transaction, txData, signedData[i]);
                console.log("Transaction Successfully Added");
              // break;
            }
            // return true;
          }
        }
      }
    }
  }
}

// processTransaction(SignedTransactionData);

// isValidTransaction(SignedTransactionData);
