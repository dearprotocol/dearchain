import {connections} from "../packages/db/memory/wss";

// Hosts a Serv
export async function emitWss(data:string){
    for(let connection of connections){
        connection.sendUTF(data)
        console.log(connection)
    }
    
}
// setInterval(() =>{
//      emitWss("hi");
// }, 5000)


// BLOCK ADDED

// TX SUBMITTED

// SUBMIT BLOCK
