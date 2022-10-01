
import { Trie, LevelDB } from '@ethereumjs/trie'
import { Level } from 'level'
const blockDB =new  Level('../../../DEARCHAIN_BLOCK_DB')


export async function getBlock(){
    blockDB.open
let arr:any = []; 
    let iterator:any = await blockDB.iterator().all()

    arr.push(iterator)


    console.log("ghfhgv",arr)

//   return keys

    return arr
}





getBlock();