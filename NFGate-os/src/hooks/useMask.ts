import { useEffect } from "react"
import maskStore from "../store/maskStore"
import web3Store from "../store/Web3Store"

const useMask = () => {
    useEffect(()=>{
        if(!web3Store.account) return 
        console.log("setMust?")
        maskStore.setIsMask(true)
        setTimeout(() => {
           maskStore.setIsMask(false) 
        }, 1000);
    },[
        web3Store.account
    ])
}

export default useMask