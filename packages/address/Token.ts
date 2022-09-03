export function createTokenAddress(name:String,nounce:number=2500){
    let address = name + '-' +(nounce).toString(16).padStart(7,'0');
    return {address,newNounce:nounce+1}
}