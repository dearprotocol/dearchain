export const DNS:iDNS = {
    "dearprotocol.web":{
        "NSType":"internal",
        "nameservers":["internal"],
        "records":[
            {
                "recordType":"A",
                "host":"@",
                "value" : "127.0.0.1"
            }
        ],
        "routes":[
            {
                "path":'/',
                "page":'any'
            }
        ]
    }
}

interface iDNS {
    [key:string]:{
        NSType:"internal"|"external",
        nameservers:Array<string>
        records:Array<iRecord>,
        routes?:Array<iRoutes>
    }
}
interface iRecord{
    recordType:"A"|"AAAA"|"MX"|"TXT"|"CNAME",
    host:string,
    priority?:number,
    value : string
}

interface iRoutes{
    path:'/',
    page:'any'
}