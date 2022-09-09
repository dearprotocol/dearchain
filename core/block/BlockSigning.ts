// Sign Block

import { calculateHash } from "../transaction/TransactionSigning";
import { rawBlock } from "../../interfaces/Block";
import { PRIVATE_KEY } from "../../Constant";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { convertToHex, getAddress } from "../../packages/address/external";

import { createBlock } from "./Block";
import { TransactionPoolDB } from "../../packages/db/memory/transactionpool";
import { isValidTransaction, validateTransfer } from "../transaction/TransactionValidation";

function signBlock(
  nonce: number,
  blockNumber: number,
  validator: string,
  prevBlockHash: string
) {
  try {
    const privatekey = Buffer.from(PRIVATE_KEY, "hex"); //VALIDATOR PRIVATE KEY
    let transactions:Array<TxPair> = [];
    for(let key in TransactionPoolDB.txData){
      // console.log(key);
      if(isValidTransaction(TransactionPoolDB.txData[key])){
        transactions.push({
          hash:key,
          data:TransactionPoolDB.txData[key]
        });
      }
    }
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
    console.log("blockSignature", convertToHex(blockSignature.signature)); // generated block signature
    console.log("blockSignature", blockSignature.recid);

    let blockRecid = blockSignature.recid.toString(16); //recid takes value from 0 to 3 and it should be in two digit format

    if (blockRecid.length < 2) {
      blockRecid = "0" + blockRecid;
    }

    let rawBlockData =
      convertToHex(blockSignature.signature) +
      blockRecid +
      newBlock.blockData.toString("hex");

    console.log("Block Transaction : ", rawBlockData);

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

// createBlock(1,[],4042,"f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b","0x1")

signBlock(
  1,
  4042,
  "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",
  "0x1"
);

export interface TxPair{
  hash:string,
  data:string
}