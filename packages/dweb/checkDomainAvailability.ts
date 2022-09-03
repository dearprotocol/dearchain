import { DNS } from "../db/memory/dweb";

export function isDomainAvailable(domainName:string){
    if(DNS[domainName+'.web'] == undefined){
        return true;
    }
    return false;
}