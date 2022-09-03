import { DNS } from "../db/memory/dweb";
import { isDomainAvailable } from "./checkDomainAvailability";

export function addADomain(domainName:string,nsType:string="internal",nameservers:Array<string>=["internal"],routes:any,records:any={}){
    if(isDomainAvailable(domainName)){

    }else{
        throw new Error("DEARCHAIN: DOMAIN EXISTS")
    }
}