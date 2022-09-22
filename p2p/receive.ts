// Receives EVENT\

// BLOCK ADDED
function blockAdded(data:string){
    // data: <BLOCKNUMBER 64><SIGNATURE 128><RECID 2><BLOCKDATA REST>
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

// VALID BLOCK