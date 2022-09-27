import { connections } from "../packages/db/memory/wss";

var WebSocketClient = require('websocket').client;

export const clientStart = (url:string,retries:number=0) =>{
    var client = new WebSocketClient();
    client.on('connectFailed', function(error:any) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection:any) {
        connections.push(connection)
        // store keys

        connection.on('error', function(error:any) {
            console.log("WARN: Connection Error: " + error.toString());

        });
        connection.on('close', function() {
            console.log('WARN: Connection Closed! Retry in 5 sec');
            // Try Reconnecting 10 times ...
            if(retries < 10){
                setTimeout(()=>{
                    clientStart(url,retries+1);
                },5000)
            }
        });
        connection.on('message', function(message:any) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
                let data = JSON.parse(message.utf8Data);
            }
        });
    });

    client.connect(url, 'echo-protocol');
}

clientStart('https://696c-103-42-157-177.in.ngrok.io/')