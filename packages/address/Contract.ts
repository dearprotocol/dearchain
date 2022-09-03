import SHA3 from "sha3";
import { prefixes } from "./contants";

export function createContractAddress(code:string,nounce:number=0){
    let hash = new SHA3(256);
    hash.update(code)
    hash.update((nounce).toString(16).padStart(2,'0'));
    let address = prefixes.contract + hash.digest('hex');
    return {address,code,newNounce:nounce+1}
}