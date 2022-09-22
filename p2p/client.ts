import { connections } from "../packages/db/memory/wss";

var WebSocketClient = require('websocket').client;

export const client = () =>{
    var client = new WebSocketClient();
const SignedTransactionData =
  "dd706df2495a07d09c68e67438b6fd0d3c6dc118757b5d93556136a627a91ae42bc7753ecd70e79d1e8b8fbfa2cd00fc41df88d3333c65abf562b67c802ef292007b226e6f6e6365223a2230222c22666565734f666665726564223a302e30322c2266726f6d223a226637383762373436393864643430313665646563383561393238343561373439366637343233613861656664646337303064313164643462222c2274797065223a225452414e53464552222c22746f6b656e5472616e73666572223a5b7b22746f6b656e4964223a2244454152222c22616d6f756e74223a352c22746f223a223461363830353037313430306166643365363164383266663962313133626233363733366239663332316364313036613466376235373130227d5d2c22657874726144617461223a22227d";
client.on('connectFailed', function(error:any) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection:any) {
    // console.log('WebSocket Client Connected');

    connections.push(connection)

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
    
    // function sendNumber() {
    //     if (connection.connected) {
    //         var number = Math.round(Math.random() * 0xFFFFFF);
    //         connection.sendUTF(number.toString());
    //         setTimeout(sendNumber, 1000);
    //     }
    // }
    function sendTransaction(){
        connection.sendUTF(JSON.stringify({"method": "sendTransaction", "rawTransaction": SignedTransactionData}))
    }
    sendTransaction()
});

client.connect('https://696c-103-42-157-177.in.ngrok.io/', 'echo-protocol');
}

client()