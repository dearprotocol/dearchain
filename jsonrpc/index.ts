import express from 'express'
import https from 'https'
import * as fs from 'fs';
import * as path from 'path';
const app = express();

app.use('/',(req,res,next)=>{

    if(req.method!="POST"){
        console.log(req.ip);
        res.send("Only POST request is allowed in JSON RPC server")
    }else{
        console.log(req.body);
        console.log(req.ip);
        res.send("Good to See You")
    }
});
let server = https.createServer({
    key:fs.readFileSync(path.join(__dirname,'cert','key.pem')),
    cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
},app);
server.listen(4434,()=>console.log("Secure 🚀 🔑JSON RPC Server 🚦🚦 Started.."))