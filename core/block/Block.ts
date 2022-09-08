
import { rawBlock } from "../../interfaces/Block"

export function block(){
    const newBlock : rawBlock  = {

        nonce:number,
        transactions: Array<string>,
        number:number,
        validator:string,
        totalCollectedFees:number,
        feesBurnt:number,
        feesToDao:number,
        feesToValidator:number,
        feesToTxnValidator:number,
        prevBlockHash : string,
        timestamp :number,



    }



}