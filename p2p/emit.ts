import {connections} from "../packages/db/memory/wss";

// Hosts a Serv
export async function emitWss(data:string){
    console.log("connections",connections);
    for(let connection of connections){
        connection.sendUTF(data)
    }
}
setInterval(() =>{
     emitWss("hi");
}, 5000)


// BLOCK ADDED

// TX SUBMITTED

// SUBMIT BLOCK
