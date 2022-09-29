import { connections } from "../packages/db/memory/wss";

var WebSocketClient = require('websocket').client;

// export const clientStart = (url:string,retries:number=0) =>{
    var client = new WebSocketClient();

    client.on('connectFailed', function(error:any) {
        console.log('Connect Error: ' + error.toString());
    });
    
    client.on('connect', function(connection:any) {
        console.log('WebSocket Client Connected');
        connection.on('error', function(error:any) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', function(message:any) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            }
        });
        
    });

    client.connect('ws://localhost:8080/', 'echo-protocol');
// }

// clientStart('https://ace3-103-42-156-112.in.ngrok.io',3)