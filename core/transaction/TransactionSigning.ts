import { generateAddress } from "../generateAddress";
import { randomBytes, createHash } from "crypto";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { PRIVATE_KEY } from "../../Constant";
import {
  convertTo64BaseBuffer,
  convertToHex,
} from "../../packages/address/external";
import { isValid } from "./TransactionValidation";

// generateAddress(true);

const transaction: any = [];
const from = "7b28c810a305f31f55b8b45226ef372e89a1ec1ba718a441d4a6b6ad";
const to = "4a6805071400afd3e61d82ff9b113bb36736b9f321cd106a4f7b5710";

const calculateHash = (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  if (fromAddress && toAddress && amount) {
    const hash = new SHA3(256);

    hash.update(fromAddress + toAddress + amount);
    let txn = hash.digest("hex");

    return txn;
  }
};

const newTxn = (fromAddress: string, toAddress: string, amount: number) => {
  const txnHash = calculateHash(fromAddress, toAddress, amount);
  transaction.push(txnHash); //add txnHash

  console.log(transaction);
};

export const signTransaction = (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  try {
    if (fromAddress) {
      let privatekey = convertTo64BaseBuffer(PRIVATE_KEY);
      const hashTx: any = calculateHash(fromAddress, toAddress, amount);
      let data_ = convertTo64BaseBuffer(hashTx);
      const sig = secp256k1.ecdsaSign(data_, privatekey);
      console.log("signTransaction", convertToHex(sig.signature));
      console.log("signTransaction", (sig.recid));
      // const signature = sig.signature;

      isValid(sig,data_)

      return sig
      
    }
  } catch (error) {
    console.log(error);
  }
};

signTransaction(from, to, 5);
