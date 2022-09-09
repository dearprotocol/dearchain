import {connections} from "../packages/db/memory/wss";

// Hosts a Serv
async function send(data:string){
    console.log("connections",connections);
    for(let connection of connections){
        connection.sendUTF(data)
    }
}
setInterval(() =>{
     send("hi");
}, 5000)


// BLOCK ADDED

// TX SUBMITTED

// SUBMIT BLOCK
