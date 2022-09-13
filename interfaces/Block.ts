import { TxPair } from "../core/block/BlockSigning";
import { Transaction } from "./Transaction";

export interface Block{
    nonce:number,
    transactions: Array<TxPair>,
    number:number,
    validator:string,
    totalCollectedFees:number,
    feesBurnt:number,
    feesToDao:number,
    feesToValidator:number,
    feesToTxnValidator:number,
    blockhash:string,
    prevBlockHash : string,
    timestamp :number,

}


export interface rawBlock{
    nonce:number,
    transactions: Array<TxPair>,
    number:string,
    validator:string,
    totalCollectedFees:number,
    feesBurnt:number,
    feesToDao:number,
    feesToValidator:number,
    feesToTxnValidator:number,
    prevBlockHash : string,
    timestamp :number,

}

// 20
// 1
// 7