export const AddressDB:iAddress = {
    "f787b74698dd4016edec85a92845a7496f7423a8aefddc700d11dd4b":{
        balance:{
            "DEAR":"10000000"
        },
        nonce:"0"
    }

}

interface iAddress {
    [key:string]:{
        balance:{
            [key:string]:string
        },
        nonce : string,
    }
    
}