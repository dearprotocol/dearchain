import { Transaction } from "./Transaction";

export interface Block{
    nonce:number,
    transactions: Array<string>,
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

// 20
// 1
// 79

// from : YOUR ($100) -> input
// to : [YOUR ($79), SUBHAM ($20)] -> output


// Address InnoDB
// add: Balance

// YOUR : $100
// SUBHAM : $0
// VALIDATOR: $0

// from: YOUR($100)
// to : SUBHAM($20)
// txFees: $1

// ADDRESS=> HAS MORE THAN $21 +> TRUE/FALSE

// UPDATE => YOUR:$79
// SUBHAM: $20
// VALIDATOR: $1