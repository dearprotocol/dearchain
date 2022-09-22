// Sign Block

import { calculateHash } from "../transaction/TransactionSigning";
import { rawBlock } from "../../interfaces/Block";
import { PRIVATE_KEY } from "../../Constant";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { convertToHex, getAddress } from "../../packages/address/external";



import { createBlock } from "./Block";
import { TransactionPoolDB } from "../../packages/db/memory/transactionpool";
import {
  isValidTransaction,
  validateSignature,
  validateTransfer,
} from "../transaction/TransactionValidation";
import { RawTransaction } from "../../interfaces/Transaction";
// import { testing } from "../../test/Trie/trie";





let walletAddr:any[] =[]


export function signBlock (
  nonce: number,
  blockNumber: number,
  validator: string,
  prevBlockHash: string
){
  try {

    let temp:any[] =[]
    
    const privatekey = Buffer.from(PRIVATE_KEY, "hex"); //VALIDATOR PRIVATE KEY
    let transactions: Array<TxPair> = [];
    let uniqueWallet:any;
    for (let key in TransactionPoolDB.txData) {

      uniqueWallet = uniqueWalletTxn(TransactionPoolDB.txData[key]);

      temp = [...new Set(walletAddr)]
      // console.log("unqiue wallet 1",temp)


      if (isValidTransaction(TransactionPoolDB.txData[key])) {
            // if (temp) { //unique wallet address if exist then only add yarn installtransactions 
            // console.log("working"); 
            transactions.push({
              hash: key,
              data: TransactionPoolDB.txData[key],
            });

            
    
          // } 
           
          }

          

      
    }

//for later use Wallet Address check .... 
   

// for (let key in TransactionPoolDB.txData) {

    //   if (isValidTransaction(TransactionPoolDB.txData[key])) {
    //     if (temp) {
    //     console.log("working"); 
    //     transactions.push({
    //       hash: key,
    //       data: TransactionPoolDB.txData[key],
    //     });

    //   } 
       
    //   }
      
    // }

    
    const newBlock = createBlock(
      nonce,
      transactions,
      blockNumber,
      validator,
      prevBlockHash
    );
    const blockSignature = secp256k1.ecdsaSign(
      Buffer.from(newBlock.blockHash, "hex"),
      privatekey
    ); //signing a block
    // console.log("blockSignature", convertToHex(blockSignature.signature)); // generated block signature
    // console.log("blockSignature", blockSignature.recid);

    let blockRecid = blockSignature.recid.toString(16); //recid takes value from 0 to 3 and it should be in two digit format

    if (blockRecid.length < 2) {
      blockRecid = "0" + blockRecid;
    }

    let rawBlockData =
      convertToHex(blockSignature.signature) +
      blockRecid +
      newBlock.blockData.toString("hex");

    // console.log("Block Transaction : ", rawBlockData);

    return {
      signature: convertToHex(blockSignature.signature),
      recId: blockRecid,
      rawTransaction: rawBlockData,
      transactionHash: newBlock.blockHash,
    };
  } catch (error) {
    console.log(error);
  }
}

export function uniqueWalletTxn(txnData: string) {

// console.log(txnData)

let signature = txnData.slice(0, 128);
  let recId = txnData.slice(128, 130);
  let txn_Data = txnData.slice(130, txnData.length)
  let txid = calculateHash(txn_Data);
  let recoveredPublicKey = secp256k1.ecdsaRecover(
    Buffer.from(signature, "hex"),
    parseInt(recId, 16),
    Buffer.from(txid, "hex")
  );

  let address = getAddress(convertToHex(recoveredPublicKey))
  let walletAddress = convertToHex(address)


  // let arr:string []= [] ;

    walletAddr.push(walletAddress)
    // console.log(walletAddr)

  return walletAddress;
}
// createBlock(1,[],4042,"f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b","0x1")

signBlock(
  1,
  4042,
  "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",
  "0x1"
);





export interface TxPair {
  hash: string;
  data: string;
}
