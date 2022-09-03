import SHA3 from "sha3";
import { prefixes } from "./contants";

export function createDAOAddress(data:string,nounce:number=0){
    let hash = new SHA3(256);
    hash.update(data)
    hash.update((nounce).toString(16).padStart(2,'0'));
    let address = prefixes.dao + hash.digest('hex');
    return {address,data,newNounce:nounce+1}
}