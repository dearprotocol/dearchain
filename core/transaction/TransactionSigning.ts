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
import { RawTransaction } from "../../interfaces/Transaction";

// generateAddress(true);

const transaction: any = [];
const from = "7b28c810a305f31f55b8b45226ef372e89a1ec1ba718a441d4a6b6ad";
const to = "4a6805071400afd3e61d82ff9b113bb36736b9f321cd106a4f7b5710";


// const 


const calculateHash = (data: string):string => {

    const hash = new SHA3(256);

    hash.update(data);
    let txn = hash.digest("hex");
    console.log(txn)

    return txn;
};

const newTxn = (
  fromAddress: string,
  toAddress: string,
  amount: number,
  fees: number,
  nonce:string
) => {
  
  const newTransaction: RawTransaction = {
    nonce: "0",
    feesOffered: fees,
    from: fromAddress,
    type: "TRANSFER",
    tokenTransfer: [
      // Multiple Transactions can be performed
      {
        tokenId: "DEAR",
        amount: amount,
        to: toAddress,
      },
    ],

    extraData: "",
  };

  const data =Buffer.from(JSON.stringify(newTransaction),"ascii");
  // const myConst = Buffer.from(data, "ascii");
  // console.log("MyConst ", myConst);
  // const decrypt = myConst.toString("ascii");
  // console.log("Decrypt", decrypt);
  console.log("TxnData", newTransaction);
  const txnHash = calculateHash(data.toString("hex"));

  console.log("TxnHash", txnHash);
  // transaction.push(txnHash); //add txnHash
  // console.log(transaction);

  return {
    data: data,
    txnHash: txnHash,
  };
};

export const signTransaction = (
  fromAddress: string,
  toAddress: string,
  amount: number,
  nonce:string
) => {
  try {
    if (fromAddress) {
      let privatekey = convertTo64BaseBuffer(PRIVATE_KEY);
      // const hashTx: any = calculateHash(fromAddress, toAddress, amount,);
      // let data_ = convertTo64BaseBuffer(hashTx);
      // const sig = secp256k1.ecdsaSign(data_, privatekey);
      // console.log("signTransaction", convertToHex(sig.signature));
      // console.log("signTransaction", sig.recid);
      // // const signature = sig.signature;

      // isValid(sig, data_);

      // return sig;

      const txn = newTxn(fromAddress,toAddress,amount,0.02,nonce)
      console.log("Transaction",txn);

      const signature = secp256k1.ecdsaSign(Buffer.from(txn.txnHash,'hex'),privatekey);
      console.log("signature",convertToHex(signature.signature))
      console.log("signature",signature.recid)

      return signature
    }
  } catch (error) {
    console.log(error);
  }
};

signTransaction(from, to, 5,"14");
// newTxn(from,to,500,5,0)