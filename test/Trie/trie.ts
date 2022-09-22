import { Trie, LevelDB } from '@ethereumjs/trie'
import { Level } from 'level'
// import { LevelDB } from '@ethereumjs/trie'
// const { Account, BN, bufferToHex, rlp } = require ('ethereumjs-util') ;

const dearDB = new Level('DEARCHAIN_TRANSACTION_DB')
// const trie = new Trie({ db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')) })


async function test() {



  
}




async function testDB(txnHash:string){

  
    dearDB.get(txnHash, function(err, value) {    
      if (err) {  
        return console.log(err);  
      }  
      console.log('value:', value);  
    });
  
  
    // testing(txnHash)
  
    
  
  }

  testDB("d2dc321623b60c2a89b4e36910e374a0409ca70a28890928e1827478db6a5ac4")
  