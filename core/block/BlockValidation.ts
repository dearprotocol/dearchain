// Validate Block

import { RawTransaction } from "../../interfaces/Transaction";
import { TransactionPoolDB } from "../../packages/db/memory/transactionpool";
import { calculateHash } from "../transaction/TransactionSigning";
import { validateSignature, validateTransfer } from "../transaction/TransactionValidation";
import secp256k1 from "secp256k1";
import { SHA3 } from "sha3";
import { convertToHex, getAddress } from "../../packages/address/external";
import { PRIVATE_KEY } from "../../Constant";

const BLOCK_RAW_DATA = "b3ec0f8e8bd72b85e4bb46f2b15a5b9e85d420dd2a916b5ec9e38b83d4b47fa95536fb6ec249e0c46cb29c66a3235afdec35bea2f35ad8d56ade1a2ec891cf8d007b226e6f6e6365223a312c227472616e73616374696f6e73223a5b5d2c226e756d626572223a343034322c2276616c696461746f72223a226637383762373436393864643430313665646563383561393238343561373439366637343233613861656664646337303064313164643462222c22746f74616c436f6c6c656374656446656573223a302c22666565734275726e74223a302e3030312c2266656573546f44616f223a302e30312c2266656573546f56616c696461746f72223a302e30322c2266656573546f54786e56616c696461746f72223a302e30322c2270726576426c6f636b48617368223a22307831222c2274696d657374616d70223a313636323633383839383736357d"

export const isBlockValid = (rawBlockData : string) => {
  const signedData = TransactionPoolDB;

  // let fetchTxnData = []

  // console.log(signedData.txData)
  for (let txData in signedData) {  //fetching Transaction Pool 
    const element = signedData[txData];
    // console.log("element",element)

    for (let i in element) {
      console.log(i);
      let dataTxn = element[i];
      console.log(dataTxn);

      if (dataTxn.length > 130) { // transaction pool signature check for block validation 
        let signature = dataTxn.slice(0, 128);
        let recId = dataTxn.slice(128, 130);
        let txnData = dataTxn.slice(130, dataTxn.length);
        let transaction: RawTransaction = JSON.parse(
          Buffer.from(txnData, "hex").toString("ascii")
        );

        // validateSignature(transaction, txnData, signature, recId);
        if (validateSignature(transaction, txnData, signature, recId) && validateTransfer(transaction)) {

            
          console.log("Working");

        
          let blockSignature = rawBlockData.slice(0, 128);
          let blockRecId = rawBlockData.slice(128, 130);
          let blockTxnData = rawBlockData.slice(130, rawBlockData.length);
          let blockTransaction: RawTransaction = JSON.parse(
            Buffer.from(blockTxnData, "hex").toString("ascii")
          );


         if (blockValidateSignature(blockTransaction,blockTxnData,blockSignature,blockRecId)){

         }

         else{
            console.log("Error: Validating Block ")
         }



        }
      }
    }
  }
};

function blockValidateSignature(  transaction: RawTransaction,
  txData: string,
  signature: string,
  recId: string){

    let txid = calculateHash(txData);
    let recoveredPublicKey = secp256k1.ecdsaRecover(
        Buffer.from(signature, "hex"),
        parseInt(recId, 16),
        Buffer.from(txid, "hex")
      );
      let address = getAddress(convertToHex(recoveredPublicKey));
      console.log(
        secp256k1.ecdsaVerify(
          Buffer.from(signature, "hex"),
          Buffer.from(txid, "hex"),
          secp256k1.publicKeyCreate(Buffer.from(PRIVATE_KEY, "hex"))
        )
      );
      console.log("Block RecoverAddress :", convertToHex(address));
    
      return address;
}


isBlockValid(BLOCK_RAW_DATA);

