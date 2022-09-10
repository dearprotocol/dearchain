export interface iStateChange{
    // TODO: Inspect All Required Stuff
    balance : Array<iBalanceUpdate>

}


interface iBalanceUpdate{
    asset:string ,
    value:string,
    type:"plus"  | "minus",
    address: string
}
