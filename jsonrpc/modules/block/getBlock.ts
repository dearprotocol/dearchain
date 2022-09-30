
import { Trie, LevelDB } from '@ethereumjs/trie'
import { Level } from 'level'
const blockDB =new  Level('../../../DEARCHAIN_BLOCK_DB')


export function getBlock(){
    blockDB.open
let arr:any = []; 
    let iterator:any = blockDB.iterator().all(function (err, data) {
        if(err){

        }
        else{
            console.log(data)
        }
    })

    arr.push(iterator)


    console.log(arr)

//   return keys

    return arr
}





getBlock();