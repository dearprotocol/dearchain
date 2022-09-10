// Update Address Balance

import BigNumber from "bignumber.js";
import { AddressDB } from "../../packages/db/memory/address";

export function updatebalance(
  address: string,
  newBalance: BigNumber,
  asset: string,
  nonceIncrement: boolean,fees:number
) {
  if (AddressDB[address] !== undefined) {
    // Address Does Exist

    // if(AddressDB[address].balance[asset] !== undefined){

    if (nonceIncrement) {
      let oldNonce = BigNumber(AddressDB[address].nonce);

      AddressDB[address].nonce = oldNonce.plus(BigNumber(1)).toFixed();
    }

    // Holder Of that asset

    AddressDB[address].balance[asset] = newBalance.toFixed(8);

    updateFees(address,fees)

    // console.log(AddressDB)

  } else {
    // Address Doesnt Exist

    AddressDB[address] = {
        balance: {
            
        },
        nonce : "0"
    } 
    AddressDB[address].balance[asset] = newBalance.toFixed(8)

    // return false;
  }
}


function updateFees(address:string,fees:number){

// console.log(fees);

const minusFees = BigNumber(AddressDB[address].balance["DEAR"]).minus(fees)

AddressDB[address].balance["DEAR"] = minusFees.toFixed()


// console.log("fees deducted",minusFees)


}