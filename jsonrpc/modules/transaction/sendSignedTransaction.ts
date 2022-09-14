//  MAKE IT

import { calculateHash, signTransaction } from "../../../core/transaction/TransactionSigning";
import axios from 'axios'
import { isValidTransaction } from "../../../core/transaction/TransactionValidation";
import { RawTransaction } from "../../../interfaces/Transaction";
import { TransactionPoolDB } from "../../../packages/db/memory/transactionpool";
//dummy 
// const transaction: any = [];
// const from = "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b"
// const to = "c7ef5fd3009f0019c177f3b38883eef58ee3057222f1c7d2a194ded5";
//


// export function sendSignedTransaction(req: any, res: any){
export function sendSignedTransaction(txData:string[]){

    //txData 0 element 
    //signature recid data 
    //txpool add
    // emmit new transaction added res txn hash
    //method sendsigntransaction

    //body {"jsonrpc":"2.0","method":"sendsignedtransaction","params":["0fabcA1698"]}

    console.log(txData[0])


    let signature = txData[0].slice(0, 128);
    let recId = txData[0].slice(128, 130);
    let data = txData[0].slice(130, txData[0].length);
    let tx: RawTransaction = JSON.parse(
      Buffer.from(data, "hex").toString("ascii")
    );

//    let data  = Buffer.from(txData[0])

const txid = calculateHash(data);

//    console.log("txdata",txData)

    let transaction;

    //   console.log("transaction" , transaction.transactionHash);

    if(txData[0]){
        if( isValidTransaction(txData[0])){

            TransactionPoolDB.txData[txid] = txData[0];
            console.log("working");

            console.log(TransactionPoolDB);
        }


    }
  

    return {txid,...tx}



}
