import path from "path";
import * as fs from "fs";
import { emitWss } from "../../p2p/emit";
import { rawBlock } from "../../interfaces/Block";
import { signBlock, TxPair } from "../block/BlockSigning";
import { calculateHash } from "../transaction/TransactionSigning";
import { createBlock } from "../block/Block";
import { isBlockValid } from "../block/BlockValidation";
import { AddressDB } from "../../packages/db/memory/address";
import BigNumber from "bignumber.js";
import { BlocksDB, LastBlock } from "../../packages/db/memory/blocks";
import { ValidatorsDB } from "../../packages/db/memory/validator";

import { Trie, LevelDB } from "@ethereumjs/trie";
import { Level } from "level";
import { blockAdded } from "../../p2p/receive";
const dearDB = new Level("DEARCHAIN_TRANSACTION_DB");
const balanceDB = new Level("DEARCHAIN_BLOCK_DB");
const blockDB = new Level("DEARCHAIN_BALANCE_DB");
const validatorDB = new Level("DEARCHAIN_VALIDATOR_DB");

const genesisFileConntent = fs
  .readFileSync(path.join(process.cwd(), "core", "genesis.json"))
  .toString();
const transactions: TxPair[] = JSON.parse(genesisFileConntent).transactions;
const blockNumber: number = JSON.parse(genesisFileConntent).number;
const validator: any = JSON.parse(genesisFileConntent).validators;
const alloc: any = JSON.parse(genesisFileConntent).alloc;

// const prevBlockHash:string = JSON.parse(genesisFileConntent).transactions;
const timestamp = Date.now();

//rvf //rtf extension name for transaction and validator data
let blockNum: number;
let hash: any;
let prevHash: any;
let blockData: any;

let hexBlockNumber: string;

let signature: string;
let recId: string;

export function BlockEmit() {
  const genesis = createGenesisBlock();
  const genesisHash = genesis.blockHash;

  let blockdata: any;
  blockNum = 1;
  setInterval(() => {
    if (blockNum == 1) {
      hash = signBlock(
        1,
        blockNum,
        "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",
        genesisHash
      );

      let blockInfo: any = isBlockValid(hash.rawTransaction);
      prevHash = hash.transactionHash;
      blockData = blockInfo.blockdata;

      // console.log("blockdata",blockData)
      blockNum = blockNum + 1;

      hexBlockNumber = blockNum.toString(16);

      // console.log("blockNumber",hexBlockNumber)
      // console.log("newblockNum",blockData);
    } else if (prevHash) {
      // console.log("prevHash",prevHash);

      hash = signBlock(
        1,
        blockNum,
        "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",
        prevHash
      );

      prevHash = hash.transactionHash;

      let blockInfo: any = isBlockValid(hash.rawTransaction);
      blockData = blockInfo.blockdata;
      signature = blockInfo.signature;
      recId = blockInfo.recId;

      // console.log(hash.transactionHash)
      blockNum = blockNum + 1;
      hexBlockNumber = blockNum.toString(16).padStart(64, "0"); // decimal to hex with 64 len
      // hexBlockNumber =

      console.log(": ", hexBlockNumber, signature, recId, blockData);
      // console.log("newblockNum",blockData);
    }
    emitWss(
      JSON.stringify({
        event_name: "Block_Added",
        hexBlockNumber,
        signature,
        recId,
        blockData,
      })
    );

    appendData(hexBlockNumber, signature, recId, blockData);
  }, 20000);
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
    blockNumber,
  };
}

function appendData(
  hexBlockNumber: string,
  signature: string,
  recId: string,
  blockData: string
) {
  if (!fs.existsSync("generatedBlock.txt")) {
    fs.closeSync(fs.openSync("generatedBlock.txt", "w"));
  }

  const file = fs.readFileSync("generatedBlock.txt", "utf-8");
  console.log(file);
  let data = { hexBlockNumber, signature, recId, blockData };
  //  let data ={ hexBlockNumber}

  const newData = JSON.stringify(data);

  if (file.length == 0) {
    fs.appendFile("generatedBlock.txt", newData, function (err) {
      if (err) throw err;
      // console.log('Updated!');
    });
  } else {
    fs.appendFile("generatedBlock.txt", newData, function (err) {
      if (err) throw err;
      // console.log('Updated!');
    });
  }
}

export default function init() {
  let data = createGenesisBlock();

  // Memory DB -----------------------------------------------
  // Block =-----------------------------------------------
  BlocksDB[data.blockHash] = data.blockData.toString("hex");
  // console.log(BlocksDB);
  LastBlock.data = data.blockData.toString("hex");
  LastBlock.hash = data.blockHash;
  LastBlock.number = data.blockNumber;
  let dbType = "block";
  checkStorageDB(dbType, data.blockHash, BlocksDB[data.blockHash]); //store block data

  // console.log(BlocksDB)
  // Block =-----------------------------------------------
  // Balance
  for (let address in alloc) {
    AddressDB[address] = {
      balance: {
        DEAR: BigNumber(alloc[address]).toFixed(8),
      },
      nonce: "0",
    };

    let dbType = "balance";
    // checkStorageDB(dbType, address, AddressDB[address].balance[address]); // Address (Dump Complete AddressDB Obj)
  }
  // Validators ----------------------------------------------

  for (let address in validator) {
    ValidatorsDB[address] = BigNumber(validator[address]).toFixed(8);

    let dbType = "validator";

    checkStorageDB(dbType, address, ValidatorsDB[address]);
  }

  // Validators ------------------------------------------
}

async function checkStorageDB(dbType: string, key: string, value: string) {
  // await dearDB.open()
  // console.log(dearDB.status)

  // let type: any = dbType
  // type = dearDB.sublevel(type)
  // const subdb = type.sublevel()
  let address = key;
  let data = value;
  let val: any;

  switch (dbType) {
    case "balance":
      balanceDB.open();
      console.log("",balanceDB.status)
      if (address && balanceDB.status == "opening") {
        balanceDB.get(key, function (err, value) {
          if (value != undefined) {
            val = true;
            console.log("working", val);
          } else {
            // console.log("..storing");
           
              
              balanceDB.put(key, data);
              // console.log("Added");
            //   if (key && data) {
              balanceDB.get(key, function (err, value) {
                console.log("Key : "+ key+" Value : "+value)
              });
            // }
          }
        });
      }

      break;
    case "block":
      // code block
      blockDB.open();
      console.log("",blockDB.status)
      if (address && blockDB.status == "opening") {
        blockDB.get(key, function (err, value) {
          if (value != undefined) {
            val = true;
            console.log("working", val);
          } 
          else {
            console.log("..storing");
           
              
              blockDB.put(key, data);

              console.log("Added");
              if (key && data) {
              blockDB.get(key, function (err, value) {
                console.log("Key : "+ key+" Value : "+value)
              });
            }
          }
        });
      }

      break;

      case "validator":

        if (address && validatorDB.status == 'opening') {

          validatorDB.get(key, function (err, value) {
           if(value != undefined ){
             val = true
             // console.log("working",val)
           }
           else{
           // console.log("adding data")

           console.log("..storing");
              validatorDB.put(key, data);
              console.log("Added");
              if (key && data) {
              validatorDB.get(key, function (err, value) {
                console.log("key:", key);
                if(value){
                  console.log("Key : "+ key+" Value : "+value)
                }
              });
            }
             
           }
         })
       }

      break;

    default:
      console.log("No Record... ");
  }

  return true;
}


init();
