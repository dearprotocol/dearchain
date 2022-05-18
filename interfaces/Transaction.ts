import { DWeb } from "./DWeb"
import { Order } from "./Order"

export interface Transaction{
    txid:string,
    nonce:number,
    amount:number,
    feesOffered:number,
    from:string,
    status:boolean,
    type:"ORDER"|"TRANSFER"|"DEPLOYMENT"|"INTERACTION"|"DAO",
    order?: Order,
    tokenTransfer?:[  // Multiple Transactions can be performed
        {
            tokenId:string,
            amount:number,
            to:string
        }
    ],
    deployment?:DWeb,
    interaction?:{
        contract:string,
        function:string,
        data:string,
    },
    daoInteraction?:{
        daoId:string,
        action:string,
        data:string
    },
    extraData:string  // Can be used as memo by exchanges and payment processors to identify user or order
}