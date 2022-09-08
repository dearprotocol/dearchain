import { calculateHash } from "../transaction/TransactionSigning"
import { rawBlock } from "../../interfaces/Block"
import {PRIVATE_KEY} from "../../Constant";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { convertToHex, getAddress } from "../../packages/address/external";

export function createBlock(nonce:number ,transactions:Array<string>,blockNumber:number,validator: string, prevBlockHash:string){
    const newBlock : rawBlock  = {

        nonce:nonce,
        transactions: transactions,
        number:blockNumber,
        validator:validator,
        totalCollectedFees:0,
        feesBurnt:0.001,
        feesToDao:0.01,
        feesToValidator:0.02,
        feesToTxnValidator:0.02,
        prevBlockHash : prevBlockHash,
        timestamp :Date.now(),

    }
    


    const blockData =  Buffer.from(JSON.stringify(newBlock),"ascii");
    // console.log("BlockData",blockData);

    const blockHash = calculateHash(blockData.toString("hex"));

    // console.log("BlockHash: ",blockHash)

   


return {

    blockData: blockData,
    blockHash: blockHash,


}


}




function signBlock(nonce:number,blockNumber:number,validator: string, prevBlockHash:string  ){

const privatekey =  Buffer.from(PRIVATE_KEY,"hex") //VALIDATOR PRIVATE KEY  
const newBlock = createBlock(nonce,[],blockNumber,validator,prevBlockHash)
const blockSignature =  secp256k1.ecdsaSign(Buffer.from(newBlock.blockHash,'hex'),privatekey)
console.log("blockSignature",convertToHex(blockSignature.signature))
console.log("blockSignature",blockSignature.recid)



}

// createBlock(1,[],4042,"f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b","0x1")

signBlock(1,4042,"f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b","0x1")