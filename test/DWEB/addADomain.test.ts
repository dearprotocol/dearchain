import { addADomain } from "../../packages/dweb/addADomain";

it("Should create a DWEB domain",()=>{
    addADomain("codepartner","internal",["internal"],[]);
})

it("Should revert with error",()=>{
    expect(addADomain("dearprotocol","internal",["internal"],[])).toThrowError("DEARCHAIN: DOMAIN EXISTS");
})