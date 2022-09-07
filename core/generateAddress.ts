import { randomBytes, createHash } from 'crypto';
import secp256k1 from 'secp256k1';
import { SHA3 } from 'sha3';

import { convertTo64BaseBuffer } from '../packages/address/external';
import { convertToHex } from '../packages/address/external';
import { getAddress } from '../packages/address/external';
import { signTransaction } from './transaction/TransactionSigning';

export const generateAddress=(random:boolean,data:string="0x1",nonce:number=0,privateKey_:string="")=>{

    try{
    let data_ = convertTo64BaseBuffer(data);
    let privatekey = Buffer.from(privateKey_,'hex');
    if(random){
        do{
            privatekey = randomBytes(32);
        }while(!secp256k1.privateKeyVerify(privatekey));
    }
    let key = secp256k1.publicKeyCreate(privatekey);
    const PRIV_KEY  = convertToHex(key);
    console.log("PrivateKey:" , PRIV_KEY);


    let signatureObject = secp256k1.ecdsaSign(data_,privatekey);

    console.log("SIGNATURE: ",convertToHex(signatureObject.signature));
    console.log(secp256k1.ecdsaVerify(signatureObject.signature,data_,secp256k1.publicKeyCreate(privatekey)))
    console.log("PUBKEY: ",getAddress(convertToHex(secp256k1.publicKeyCreate(privatekey))).toString('hex'));

}

catch(error){

    console.log(error);
}

}