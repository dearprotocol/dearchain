const address = "6a128aebb2ba72481eda0035c51d261816c8502398621af01276156a";
const privateKey =
  "e2a5a91c795adab98d9746c1ff313ac6a4ee2a9afeba629a941a3b70ed6769b0";
// const address2 = 'ba82b0961d4632a7efc20ff7e8d354235ccb70cfc1d90270bfabfa82'
// const privateKey2 = '514b2038743839f67e2ccf048b82f0b10bfb9babd18cd9ace7610c2a6b46fe1f'
// const address3 = '2cdc514cd93a6e4287f5517a8b0a7db0fd02809a1e433ffab8c75181'
// const privateKey3 = '208233a42ef85c673991e620f0153dc0ac336688163c98561dcf594aad85b707'
// const address4 = 'bb8138547b46b0fa773363d3d9566fe4e6f495ab811b959d3725b82c'
// const privateKey4 = 'e2a5a91c795adab98d9746c1ff313ac6a4ee2a9afeba629a941a3b70ed6769b0'
// const address5 = 'd40b556db70d993b7a5dd007457ee205cf21181a2aecb90045194142'
// const privateKey5 = '0210a413feee6d17f79bee5fad54949d9d24307f18013149fbd5a0e3808c3b62'
import * as fs from "fs";
import * as path from "path";
import { emitWss } from "../../p2p/emit";
const genesisFileConntent = fs
  .readFileSync(path.join(process.cwd(), "core", "genesis.json"))
  .toString();
const deligators: Array<string> = JSON.parse(genesisFileConntent).deligators;
const validators: Object = JSON.parse(genesisFileConntent).validators;
// console.log('Deligators:',deligators);
const Slot = 2;
const epochSize = JSON.parse(genesisFileConntent).epoch;

// const validator = {
//   a: 161,
//   b: 1202,
//   c: 323,
//   d: 654,
//   e: 3000,
// };

// let lastValidator: any;
let deligator: any;
 //math.floor(blocknumber/epoch) == slot number 
let newValidator: any;
let newPickedValidator:any;

function randValidator(validators: any) {
  let value = Object.keys(validators);

  let arr: string[] = [];
  for (let item in validators) {
    if (validators.hasOwnProperty(item)) {
      for (let i = 0; i < validators[item]; i++) {
        arr.push(item);
      }
    }
  }

  let rand = arr[Math.floor(Math.random() * arr.length)];


  return rand;
}

function assignValidator() {

    

    newValidator = randValidator(validators);


    console.log("new validator ",newValidator)

  if (deligator != newValidator) {
    deligator = newValidator;
  }
  console.log("Deligator",deligator) //will pick random validator excluding him
  //blocktime limit //validator picked // blocknumber  
  
  
  if (deligator == newPickedValidator || newPickedValidator == undefined) {
    for (let i = 0; i < 10; i++) {
      let newPick = randValidator(validators);

      if (newPick != deligator) {
           
        newPickedValidator = newPick;
            break;

    
      }

      
    }
  }
  emitWss(JSON.stringify({event_name: "New Picked Validator by Deligator", newPickedValidator}))
  console.log("New Picked Validator by Deligator  : "+ newPickedValidator)
//   console.log("Last Validator : "+lastValidator)
}

function start(address: string, privateKey: string, rpc: string) {
  let RPC_Deligators: Array<string> = [];
  if (deligators.includes(address) || RPC_Deligators.includes(address)) {
    // Start Deligating
    let DeligatorIndex = (Slot % deligators.length) - 1;
    // Pick a Random Validator from the Array
    // First randomize deligator
    // Then Pick one with Staked Amount and Last Validated Block
    // Set a Time Limit For Block Validaton
    // IF RECEIVED WITHIN TIME THEN EMMIT BLOCK EMMITION EVENT
    // IF NOT RECEIVED WITHIN TIME
    // THEN PICK ANOTHER ONE EXCLUDING FIRST ONE AND INCREASE NONCE BY 1
    // SET TIME REPEATE STEP 2 UNTILL STEP:4 CMPLETES SUCCESSFULLY
  } else {
    // Wait for 5 Min then try to start again
    setTimeout(() => {
      start(address, privateKey, rpc);
    }, 300000);
  }
}

assignValidator();
