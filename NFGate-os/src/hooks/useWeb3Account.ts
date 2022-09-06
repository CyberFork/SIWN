import { useEffect } from "react"
import web3Store from "../store/Web3Store"

const useWeb3Account = ()=>{ 
    useEffect(()=>{
      if( window.ethereum.selectedAddress){
        console.log("window.ethereum.selectedAddress")
        web3Store.setAccount(window.ethereum.selectedAddress)
      }
    },[
        window.ethereum
    ])
}

export default useWeb3Account