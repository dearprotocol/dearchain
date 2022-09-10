import { calculateHash } from "../transaction/TransactionSigning";
import { rawBlock } from "../../interfaces/Block";
import { PRIVATE_KEY } from "../../Constant";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { convertToHex, getAddress } from "../../packages/address/external";
import { TxPair } from "./BlockSigning";
import { emitWss } from "../../p2p/emit";

export function createBlock(
  nonce: number,
  transactions: Array<TxPair>,
  blockNumber: number,
  validator: string,
  prevBlockHash: string
) {
  const newBlock: rawBlock = {
    nonce: nonce,
    transactions: transactions,
    number: blockNumber,
    validator: validator,
    totalCollectedFees: 0,
    feesBurnt: 0.001,
    feesToDao: 0.01,
    feesToValidator: 0.02,
    feesToTxnValidator: 0.02,
    prevBlockHash: prevBlockHash,
    timestamp: Date.now(),
  };
  const blockData = Buffer.from(JSON.stringify(newBlock), "ascii");
  // console.log("BlockData",blockData);
  
  const blockHash = calculateHash(blockData.toString("hex"));
  
  // console.log("BlockHash: ",blockHash)
  emitWss(JSON.stringify({event_name: "Block_Added", blockNumber,blockHash}))

  return {
    blockData: blockData,
    blockHash: blockHash,
  };
}
