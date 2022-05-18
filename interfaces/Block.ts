import { Transaction } from "./Transaction";

export interface Block{
    nonce:number,
    transactions: Array<Transaction>
    number:number,
    validator:string,
    totalCollectedFees:number,
    feesBurnt:number,
    feesToDao:number,
    feesToValidator:number,
    feesToTxnValidator:number,
    blockhash:string
}