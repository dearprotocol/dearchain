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
// 122 + 2 + DATA
const SignedTransactionData =
  "cfe8c2a4664eb980df29b2fa9c3e208d05e1ac5df579767ad09156567d623e0d7834054403392a635a63461e227f42237812f93e2acc0e7e023a1b20baef9f39007b226e6f6e6365223a2230222c22666565734f666665726564223a302e30322c2266726f6d223a226337656635666433303039663030313963313737663362333838383365656635386565333035373232326631633764326131393464656435222c2274797065223a225452414e53464552222c22746f6b656e5472616e73666572223a5b7b22746f6b656e4964223a2244454152222c22616d6f756e74223a31342c22746f223a226637383762373436393864643430313665646563383561393238343561373439366637343233613861656664646337303064313164643462227d5d2c22657874726144617461223a22227d";

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
    // console.log(signature,recId,txData);
    let transaction: RawTransaction = JSON.parse(
      Buffer.from(txData, "hex").toString("ascii")
    );
    // console.log(transaction);
    // let balance = getBalance(transaction.from)
    // console.log(transaction.nonce);
    const type = transaction.type;
    if (validateSignature(transaction, txData, signature, recId)) {
      //&& validateTransfer(transaction)
      if (feesCheckBalance(transaction) && validateTransfer(transaction)) {
        return true;
        // switch (type) {
        //   case "TRANSFER":
        //     // updateTransfer(transaction, txData);

        //     //memory db transaction storage
        //     // updateState include txn id and transaction status
        //     //nonce +1
        //     console.log("Transaction Successfully Added");
        //     break;
        // }
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
  // console.log(
  //   secp256k1.ecdsaVerify(
  //     Buffer.from(signature, "hex"),
  //     Buffer.from(txid, "hex"),
  //     secp256k1.publicKeyCreate(Buffer.from(PRIVATE_KEY, "hex"))
  //   )
  // );
  console.log("Addr", convertToHex(address));

  return address;
}

function feesCheckBalance(txn: RawTransaction) {
  let fees;
  txn.tokenTransfer?.forEach((token, i) => {
    // console.log(AddressDB[txn.from]?.balance[token.tokenId])
    if (
      token.tokenId == "DEAR" &&
      AddressDB[txn.from]?.balance[token.tokenId] != undefined
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

function updateTransfer(transaction: RawTransaction, txData: string) {
  // const fs = require("fs");
  if (txData != undefined) {
    transaction.tokenTransfer?.forEach((token, i) => {
      const txid = calculateHash(txData);
      let nonce = 1;
      const totalAmount = BigNumber(token.amount).plus(transaction.feesOffered);
      // console.log(totalAmount.toFixed());

      const newBalance = BigNumber(
        AddressDB[transaction.from].balance[token.tokenId]
      ).minus(totalAmount);
      // console.log("newBalance", newBalance.toFixed());
      const address = transaction.from;

      // updatebalance(address, newBalance, "DEAR", true);

      const toAddress = token.to;
      let toBalance = BigNumber(token.amount);
      if (AddressDB[token.tokenId] && AddressDB[token.to].balance[token.tokenId] != undefined) {
        toBalance = BigNumber(AddressDB[token.to].balance[token.tokenId]).plus(
          toBalance
        );
      }

      // updatebalance(toAddress, toBalance, "DEAR", true);

      // console.log("check Balance", AddressDB)
      const transferComplete = true;
      emitWss(JSON.stringify({event_name: "transaction submitted", transactionHash:txid}))
    });
  }

  // if (transferComplete) {
  //   let txn = {
  //     txid: txid,
  //     nonce: nonce,
  //     fromAddress: address,
  //     toAddress: to,
  //     totalAmount: amount,
  //     fees: fees,
  //   };

  //    const newTxn = JSON.stringify(txn);
  //    fs.writeFile('transaction.json', newTxn, (err: any) => {
  //     // error checking
  //     if(err) throw err;

  //     // console.log("New data added");
  // });
}
// }

isValidTransaction(SignedTransactionData);
