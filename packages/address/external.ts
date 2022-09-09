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
            let hexChar = num.toString(16);
            if(hexChar.length !=2){
                hexChar = "0"+hexChar;
            }
            str += hexChar;
        })
        return str;
    } catch (error) {
        throw new Error("Can\'t Convert to Hex");
    }
}
// cb3b0102035ec9ece621a146bbc10443fa05326a2275a508ad3edee74da65853529264d24a628c4c269bab39be4befae65e873659ee7f5bc7aff93319afd2d47
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
    // console.log(digest);
    return Buffer.from(digest,'hex');
}