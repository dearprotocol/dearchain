import { signBlock } from "../core/block/BlockSigning";
import { isBlockValid } from "../core/block/BlockValidation";
import { calculateHash, signTransaction } from "../core/transaction/TransactionSigning";
import { isValidTransaction } from "../core/transaction/TransactionValidation";
import { convertToHex } from "../packages/address/external";
import { BlocksDB, LastBlock } from "../packages/db/memory/blocks";
import { TransactionPoolDB } from "../packages/db/memory/transactionpool";
import { emitWss } from "./emit";

const transaction: any = [];
const from = "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b"
const to = "c7ef5fd3009f0019c177f3b38883eef58ee3057222f1c7d2a194ded5";



// BLOCK ADDED
export function blockAdded(data: any) {
    // data: <BLOCKNUMBER 64><SIGNATURE 128><RECID 2><BLOCKDATA REST>
    const rawBlockData = data;
    let number = (1).toString(16).padStart(64, "0") //static 
    let blocknum=1
    console.log('number',number);
    let blockSignature = rawBlockData.slice(0, 128);
    let blockRecId = rawBlockData.slice(128, 130);
    let blockTxnData:any = rawBlockData.slice(130, rawBlockData.length);

    let blockHash:string = calculateHash(blockTxnData)

    // console.log()


    if(LastBlock.number < blocknum ){
        // console.log(BlocksDB)
        if(blocknum - LastBlock.number == 1){
            
            // ReceivedBlock.prevBlockHash == LastBlock.hash => Include
            if(blockHash == LastBlock.hash){

                LastBlock.data = blockTxnData
                LastBlock.hash = blockHash
                LastBlock.number = blocknum;

                console.log(LastBlock)
            }
              //  Last Block Number, hash and data
        }
        else{
            if(blocknum - LastBlock.number > 10){
            //  Sync Mode
                console.log("Sync MODE")

            }
            // else{


            //  for(let i=0;i<blocknum - LastBlock.number;i++){


            //  }



            // }
        }

    }
    // lastBlockNumber
    // IF lastBlockNumber is LessThan Received
    // IF(ReceivedBlockNumber - lastBlockNumber == 1){
    // ReceivedBlock.prevBlockHash == LastBlock.hash => Include
    //  Last Block Number, hash and data
    // }else{
    // IF(ReceivedBlockNumber - lastBlockNumber > 10){
    //  Sync Mode
    // }else{
    //  for(i=0;i<ReceivedBlockNumber - lastBlockNumber){

    // }
    // }
    // }

}

// TX SUBMITTED
    // => VALidate
    // TXPool => ADDED
    // EMITT TX SUBMITTED

export function txnSubmit(){

    let txn:any= signTransaction(from, to, 5,"14")
    console.log(txn)
    let txnHash:any = txn.transactionHash
    let txnData:any = txn.rawTransaction
    if(txn){

        if(txnData){
            // TransactionPoolDB[] // validate transafer will return false addressDB balance memory db is empty 
            // console.log(txn.rawTransaction)
            isValidTransaction(txnData)

           

            emitWss(
                JSON.stringify({
                  event_name: "transaction submitted",
                  transactionHash: txnHash,
                  transactionData:txnData
                  
                })
              );
        
        }


    }


}

// VALID BLOCK
    // => CHECK LAST BLOCK
    // => IF LAST BLOCK IS GREATER THEN REJECT
    // => EMITT BLOCK 



  export  function blockSubmit(){

        let block:any = signBlock(
            1,
            4042,
            "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",
            "0x1"
          );
          let rawBlockData = block.rawTransaction

         
          let blockTxnData:any = rawBlockData.slice(130, rawBlockData.length);
          let blockData: any = JSON.parse(
            Buffer.from(blockTxnData, "hex").toString("ascii")
          );

          console.log("block",blockData.number)

          if(LastBlock.number < blockData.number){

            if(block.rawTransaction){

                isBlockValid(block.rawTransaction)
                let txnHash = block.transactionHash
                let txnData = block.rawTransaction

                emitWss(
                    JSON.stringify({
                      event_name: "transaction submitted",
                      blockHash: txnHash,
                      blockData:txnData
                      
                    })
                  );
                

            }
          }



    }

// PEER LIST => LATER
  
    // 

function peerList(){


  // Peer LIST


}


// blockAdded(data)

// txnSubmit();
// blockSubmit();


