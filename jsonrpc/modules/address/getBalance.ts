//  MAKE
import {AddressDB} from "../../../packages/db/memory/address"
export const getBalance =(address:string[]) =>{
let index:string = address[0];
return AddressDB[index].balance;
}