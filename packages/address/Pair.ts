import SHA3 from "sha3";
import { prefixes } from "./contants";

export function createPairAddress(token0:string,token1:string,data:string,nounce:number=0){
    let hash = new SHA3(256);
    hash.update(data)
    hash.update((nounce).toString(16).padStart(2,'0'));
    let address = token0 + "-"+token1;
    return {address,data,newNounce:nounce+1}
}