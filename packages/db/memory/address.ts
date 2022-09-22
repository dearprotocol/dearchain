export const AddressDB:iAddress = {
    
}

interface iAddress {
    [key:string]:{
        balance:{
            [key:string]:string
        },
        nonce : string,
    }
    
}