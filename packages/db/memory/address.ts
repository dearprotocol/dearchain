export const AddressDB:iAddress = {
    "7b28c810a305f31f55b8b45226ef372e89a1ec1ba718a441d4a6b6ad":{balance:"10000000",nonce:"0"}

}

interface iAddress {
    [key:string]:{
        balance:string,
        nonce : string,
    }
    
}