import { connections } from "../packages/db/memory/wss";
import * as fs from "fs";
import * as path from "path";
import "./emit.ts"
import { signBlock } from "../core/block/BlockSigning";



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

setInterval(() =>{signBlock(
    1,
    4042,
    "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b",
    "0x1"
)},10000);

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
    connection.on('message', function(message:any) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode:any, description:any) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
// setInterval(() =>{console.log("connection",connections)},10000)