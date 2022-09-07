import { randomBytes, createHash } from 'crypto';
import secp256k1 from 'secp256k1';
import { SHA3 } from 'sha3';

export const generateAddress = (random:boolean,data:string,nonce:number=0,privateKey_:string="")=>{
    let data_ = convertTo64BaseBuffer(data);
    let privatekey = Buffer.from(privateKey_,'hex');
    if(random){
        do{
            privatekey = randomBytes(32);
        }while(!secp256k1.privateKeyVerify(privatekey));
    }
    
    let key = secp256k1.publicKeyCreate(privatekey)
    let signatureObject = secp256k1.ecdsaSign(data_,privatekey);
    console.log("SIGNATURE: ",signatureObject);
    console.log("PrivateKey:",convertToHex(key));

    // let arrBuffer = key.buffer;
    console.log(secp256k1.ecdsaVerify(signatureObject.signature,data_,secp256k1.publicKeyCreate(privatekey)))
    console.log("PUBKEY RECOV: ",getAddress(convertToHex(secp256k1.publicKeyCreate(privatekey))));
    console.log("PUBKEY RECOV: ",getAddress(convertToHex(secp256k1.ecdsaRecover(signatureObject.signature,signatureObject.recid,data_))));
}

export function convertToHex(array:Uint8Array){
    try {
        let str = "";
        array.forEach(num=>{
            str += num.toString(16);
        })
        return str;
    } catch (error) {
        throw new Error("Can\'t Convert to Hex");
    }
}

export function convertTo64BaseBuffer(message:string){
    const hash = new SHA3(256);
    hash.update(message);
    let digest = hash.digest('hex');
    console.log(digest);
    return Buffer.from(digest,'hex');
}

export function getAddress(key:string){
    const hash = new SHA3(224);
    hash.update(key);
    let digest = hash.digest('hex');
    console.log(digest);
    return Buffer.from(digest,'hex');
}