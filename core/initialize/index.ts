// let defaultParams={
//     "datadir":"$HOME/dearchain"
// }

import path from "path";
import * as fs from "fs";
import { emitWss } from "../../p2p/emit";
import { rawBlock } from "../../interfaces/Block";
import { signBlock, TxPair } from "../block/BlockSigning";
import { calculateHash } from "../transaction/TransactionSigning";
import { createBlock } from "../block/Block";
import { isBlockValid } from "../block/BlockValidation";

const genesisFileConntent = fs
  .readFileSync(path.join(process.cwd(), "core", "genesis.json"))
  .toString();
const transactions: TxPair[] = JSON.parse(genesisFileConntent).transactions;
const blockNumber: number = JSON.parse(genesisFileConntent).number;
const validator: string = JSON.parse(genesisFileConntent).validator;

// const prevBlockHash:string = JSON.parse(genesisFileConntent).transactions;
const timestamp = Date.now();

//rvf //rtf extension name for transaction and validator data
let blockNum:number;
let hash:any ;
let prevHash:any ;
let blockData:any;

function init() {
  const genesis = createGenesisBlock();
  const genesisHash = genesis.blockHash;

    
    let blockdata:any ;
    blockNum =1
    console.log("block",blockNum)
    
    
 


  setInterval(() => {

    if(blockNum == 1  ) {
        


      hash = signBlock(1,blockNum,"f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",genesisHash);

    let blockInfo:any= isBlockValid(hash.rawTransaction)
    prevHash = hash.transactionHash
    blockData = blockInfo.blockdata
    console.log("genesis",prevHash)
    console.log("newblockNum",blockNum);
    // console.log("blockdata",blockData)
    blockNum= blockNum +1

      }

      else if(prevHash){
        console.log("prevHash",prevHash);
       
        hash = signBlock(1,blockNum,"f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",prevHash);

        prevHash = hash.transactionHash
        console.log("newblockHash",prevHash);
        console.log("newblockHash",blockNum);
        // console.log(hash.transactionHash)
        blockNum= blockNum +1



        emitWss(JSON.stringify({event_name: "Block_Added", blockNumber,blockData}))
        
      }

   
  }, 2000);

    
}

function createGenesisBlock() {
  const genesisBlock: rawBlock = {
    nonce: 0,
    transactions: transactions,
    number: blockNumber,
    validator: validator,
    totalCollectedFees: 0,
    feesBurnt: 0,
    feesToDao: 0,
    feesToValidator: 0,
    feesToTxnValidator: 0,
    timestamp: timestamp,
    prevBlockHash: "",
  };
  const blockData = Buffer.from(JSON.stringify(genesisBlock), "ascii");
  const blockHash = calculateHash(blockData.toString("hex"));

  return {
    blockData: blockData,
    blockHash: blockHash,
  };
}

init();
