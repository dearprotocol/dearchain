import { generateAddress } from "../generateAddress";
import { randomBytes, createHash } from "crypto";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { PRIVATE_KEY1 } from "../../Constant";
import {
  convertTo64BaseBuffer,
  convertToHex,
} from "../../packages/address/external";
import { isValidTransaction } from "./TransactionValidation";
import { RawTransaction } from "../../interfaces/Transaction";

// generateAddress(true);

const transaction: any = [];
const from = "107aec87c97e50b46b78445a4b270c8c936664790717765626c6c130";
const to = "4a6805071400afd3e61d82ff9b113bb36736b9f321cd106a4f7b5710";


// const 


export const calculateHash = (data: string):string => {
    const hash = new SHA3(256);
    hash.update(data);
    let txn = hash.digest("hex");
    // console.log(txn);
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

  const data = Buffer.from(JSON.stringify(newTransaction),"ascii");
  // const myConst = Buffer.from(data, "ascii");
  // console.log("MyConst ", myConst);
  // const decrypt = myConst.toString("ascii");
  // console.log("Decrypt", decrypt);
  // console.log("TxnData", newTransaction);
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
      let privatekey = Buffer.from(PRIVATE_KEY1,'hex');

      const txn = newTxn(fromAddress,toAddress,amount,0.02,nonce)
      // console.log("Transaction",txn.txnHash);

      const signature = secp256k1.ecdsaSign(Buffer.from(txn.txnHash,'hex'),privatekey);
      // console.log("Signature Length",signature.signature)
      // Length: 122
      let recidHex = signature.recid.toString(16);
      if(recidHex.length < 2){
        recidHex = "0"+recidHex;
      }
      // console.log("Recover ID Hex",recidHex)
      //  128 + 2 + <EXTRA DTAT LENGTH>
      let rawtransaction = convertToHex(signature.signature) + recidHex + txn.data.toString('hex'); 
      return {
        signature:convertToHex(signature.signature),
        recId:recidHex,
        rawTransaction:rawtransaction,
        transactionHash:txn.txnHash
      }
    }
  } catch (error) {
    console.log(error);
  }
};

console.log(signTransaction(from, to, 14,"3")?.rawTransaction);
// signTransaction(from, to, 5,"14")?.rawTransaction