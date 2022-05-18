// **************************************************************
//        This file will help to Create Contract Address.
// ************************************************************** 
import {ECDH,createECDH} from 'crypto'
import { stdin } from 'process';

export const generateAddress = ()=>{
    console.log("Hello");
    // ECDH.
    let key = createECDH('secp521r1');
    console.log(key);
    console.log(key.generateKeys('hex','uncompressed').length);
    console.log(key.getPrivateKey('hex'));
    
}

// read