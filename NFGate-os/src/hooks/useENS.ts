import { useCallback, useEffect, useState } from "react"
import web3Store from "../store/Web3Store"
import { ENS } from '@ensdomains/ensjs'
import { ethers } from "ethers"

const useENS = () => {

    const [ens, setEns] = useState<ENS>()
    const [ensName, setEnsName] = useState("")

    const getENSnameByAddress = useCallback(async () => {
        console.log(
            "in the getENSnameByAddress"
        )
        if (!ens) return
        if (!web3Store.account) return
        ens.getProfile(
            web3Store.account,
        ).then((profile: any) => {
            console.log("profile is ", profile)
            if (profile && profile.name)
                setEnsName(profile.name)
        }).catch((err) => { console.log(err) })

    }, [
        ens, web3Store.account
    ])

    useEffect(() => {
        if (!web3Store.account) return


        ethers.getDefaultProvider().lookupAddress(web3Store.account).then((res: string | null) => {
            console.log("lookupAddress res is :", res)
            setEnsName(res?res:"")
        })

    }, [web3Store.account])



    useEffect(() => {
        if (!ens) return
        getENSnameByAddress()

    }, [ens])

    return ensName
}

export default useENS