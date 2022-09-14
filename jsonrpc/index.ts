import express from 'express'
import https from 'https'
import * as fs from 'fs';
import * as path from 'path';
import { getBalance } from './modules/address/getBalance';
import { getNonce } from './modules/address/getNonce';
import { getTransactionCount } from './modules/address/getTransactionCount';
import { sendSignedTransaction } from './modules/transaction/sendSignedTransaction';
const app = express();
interface iMethods {
    [key:string]:any
}


const methods:iMethods={
    "getbalance":getBalance,
    "getnonce":getNonce,
    "gettransactioncount": getTransactionCount,
    "sendsignedtransaction" : sendSignedTransaction
}



app.use(express.json())
app.use('/',(req,res,next)=>{

    if(req.method!="POST"){
        console.log(req.ip);
        res.send("Only POST request is allowed in JSON RPC server")
    }else{
        // console.log("body",req.body);
        // console.log(req.ip);
        let method:string =req.body.method;
        res.send({
            jsonrpc:req.body.jsonrpc,result:methods[method](req.body.params)
        })
    }
});
// let server = https.createServer({
//     key:fs.readFileSync(path.join(__dirname,'cert','key.pem')),
//     cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
// },app);
// server.listen(4434,()=>console.log("Secure 🚀 🔑JSON RPC Server 🚦🚦 Started.."))

app.listen(8080,()=>{console.log("Server is Listening")});