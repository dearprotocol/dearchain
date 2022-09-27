import { connections } from "../packages/db/memory/wss";
import * as fs from "fs";
import * as path from "path";
import "./emit.ts"
import { signBlock } from "../core/block/BlockSigning";
import { isValidTransaction } from "../core/transaction/TransactionValidation";
import { assignValidator } from "../core/deligator";
// import { client } from "./client";
import { BlockEmit } from "../core/initialize";
import { blockAdded } from "./receive";



var WebSocketServer = require('websocket').server;
// import websocket from 'websocket'
var http = require('http');

var server = http.createServer(function(request:any, response:any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    
    console.log((new Date()) + ' Server is listening on port 8080');
});
console.log("hi")
const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

// function originIsAllowed(origin) {
//   // put logic here to detect whether the specified origin is allowed.
//   return true;
// }
const replacerFunc = () => {
    const visited = new WeakSet();
    return (key:any, value:any) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
};

// Block Pipeline

// setInterval(() =>{
//     // let res = assignValidator()
//     let blockGenerate = init()
//     // console.log('res',blockGenerate);
//     // signBlock(
//     //     1,
//     //     4042,
//     //     "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",
//     //     "0x1"
//     // )
// },1000);
function start(){
 let res = assignValidator()
    let blockGenerate = BlockEmit()
}

start();

wsServer.on('request', function(request:any) {
    // if (!originIsAllowed(request.origin)) {
    //   // Make sure we only accept requests from an allowed origin
    //   request.reject();
    //   console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    //   return;
    // }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connections.push(connection)
    // connections[0]=connection
    // fs.writeFileSync(path.join(__dirname,'connections.json'),JSON.stringify(connection,replacerFunc()))
    
    // data = {
    //     event: "TX SUBMITTED",
    //     data: ""
    // }

    connection.on('message', function(message:any) {
        if (message.type === 'utf8') {
            let data =JSON.parse(message.utf8Data);
            switch(data.event){
                case "BLOCK ADDED":
                    blockAdded(data.data)
                    break;

                case "TX SUBMITTED":
                    break;

                case "VALID BLOCK":
                    break;
            }
        }
        else if (message.type === 'binary') {
            // DO NOTHING
        }
    });
    connection.on('close', function(reasonCode:any, description:any) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        // If its server we are not going to do reconnection
    });
});
