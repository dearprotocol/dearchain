//  MAKE IT
import {AddressDB} from "../../../packages/db/memory/address"
export const getNonce =(address:string[]) =>{
let index:string = address[0];
return AddressDB[index].nonce;
}