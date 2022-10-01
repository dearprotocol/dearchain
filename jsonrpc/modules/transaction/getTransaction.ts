//  MAKE IT
import { Trie, LevelDB } from '@ethereumjs/trie'
import { Level } from 'level'
const dearDB =new  Level('../../../DEARCHAIN_TRANSACTION_DB')


export async function getTransaction(){
 
    const arr:any[] = []; 
    try{

    dearDB.open
    let transaction:any ; 

    let iterator:any = await dearDB.iterator().all()

    // arr.push(iterator)

    console.log("DearDB_Transactions : ",iterator)

    return iterator
//   return keys
    }

    catch(err){
        console.log(err)
    }
   


}



// export async function CreateReadStream (option = {}) {
//     let array = []
//     try {    
//       const readStream:any = dearDB.(option)
//       let data:any
//       for await (data of readStream) {
//         array.push(data)
//       }
  
//       return array
//     } catch (error) {
//       console.error(error)
//     }
//   }


getTransaction();