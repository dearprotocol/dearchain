// Validate Transaction

import { randomBytes, createHash } from "crypto";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { PRIVATE_KEY } from "../../Constant";
import { convertTo64BaseBuffer, convertToHex, getAddress } from "../../packages/address/external";


export const isValid=(sign:any,data_:any)=>{
  
      if(!sign || sign.length === 0){
          throw new Error('No signature');
      }
      else{
      const privatekey = convertTo64BaseBuffer(PRIVATE_KEY);
      
        // console.log("Valid Transaction:",secp256k1.ecdsaVerify(sign.signature, data_,secp256k1.publicKeyCreate(privatekey)))
    
        console.log("ADDED : ",getAddress(convertToHex(secp256k1.ecdsaRecover(sign.signature,sign.recid,data_))).toString("hex"));
      
      
  }
}