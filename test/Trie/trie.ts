import { Trie, LevelDB } from '@ethereumjs/trie'
import { Level } from 'level'
// const { Account, BN, bufferToHex, rlp } = require ('ethereumjs-util') ;

const dearDB = new Level('DEARCHAIN_TRANSACTION_DB')
export async function testing(txnHash:string) {


  // let data = []

  // let stream = dearDB.createReadStream()
  // stream.on('end', function() {    
  //   console.log('no more data');  
  // });
}

// testing()