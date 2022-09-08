// Update Address Balance

import BigNumber from "bignumber.js";
import { AddressDB } from "../../packages/db/memory/address";

export function updatebalance(
  address: string,
  newBalance: BigNumber,
  asset: string,
  nonceIncrement: boolean
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
