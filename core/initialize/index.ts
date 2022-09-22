import { isBuffer } from "util"

let defaultParams={
    "ledger-dir":"$HOME/dearchain"
}

function init(){
    if(defaultParams["ledger-dir"] == "$HOME/dearchain"){
        // console.log(path.join(process.env.HOME,));
    }
}
init();