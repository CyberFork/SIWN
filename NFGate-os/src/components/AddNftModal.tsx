
import { useRef, useState, useImperativeHandle, useCallback, useEffect } from "react";
import 'animate.css';
import { isAddress } from "../utils/Web3Utils";
import { debounce } from "lodash"
import maskStore from "../store/maskStore";
import nftListStore, { Item } from "../store/NftListStore";
import loginStore from "../store/LoginStore";
import web3Store from "../store/Web3Store";


function TokenInput(porps: any) {
    const { debounceTokenIdInputHandle, index } = porps
    return (<>
        <div className="mt-5">

            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                Token ID
            </label>
            <input
                onChange={(e: any) => {
                    const value = e.target.value
                    debounceTokenIdInputHandle(index, value)
                }}
                type="text"
                name="token-id"
                autoComplete="off"
                className="mt-1 focus:ring-minusButton focus:border-minusButton block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
            />
        </div>
    </>)
}

function Row({ itemId, chainId, contract, minusHandle, updateRows, clearItemContract }
    : { itemId: number, chainId: number, contract: string, minusHandle: (itemId: number) => void, updateRows: (item: Item) => void, clearItemContract: (itemId: number) => void }) {
    const selection = useRef<HTMLSelectElement>(null)
    const input = useRef<HTMLInputElement>(null)
    const [selectOption, setSelectOption] = useState("")

    const [newNftContract, setNewNftContract] = useState("")

    const [tokenIds, setTokenIds] = useState<string[]>([""])

    useEffect(() => {

        if (!tokenIds || tokenIds.filter(t => !!t).length === 0) return
        if (!newNftContract) return
        const newChainId = !!selectOption ? Number(selectOption) : chainId
        if (!newChainId) return
        console.log("newChainId:", newChainId)
        console.log("newNftContract:", newNftContract)
        console.log("tokenIds:", tokenIds)

        updateRows({ itemId, chainId: newChainId, contract: newNftContract, tokenIds })
    }, [
        tokenIds, newNftContract, selectOption
    ])


    const debounceInputHandle = useRef(
        debounce((str: string) => {

            if (isAddress(str)) {

                setNewNftContract(str)
            } else {
                clearItemContract(itemId)
            }
        }, 350)
    ).current;

    const debounceTokenIdInputHandle = useRef(
        debounce((index: number, str: string) => {

            if (0 < str.length && str.length <= 64) {
                setTokenIds(tokenIds => {
                    tokenIds.splice(index, 1, str)
                    return [...tokenIds]
                })

            } else {

            }
        }, 350)
    ).current;

    const addTokenIdInput = useCallback(() => {
        setTokenIds(ts => [...ts, ""])
    }, [])

    const removeTokenIdInput = useCallback(() => {
        setTokenIds(ts => {
            if (ts.length > 1)
                return [...ts.slice(0, ts.length - 1)]
            else return ts
        }
        )
    }, [])
    return (<>

        <div className="col-span-6 sm:col-span-3">

            <label htmlFor="country" className="text-sm font-medium text-gray-700 flex justify-between">

                Chain  {itemId !== 1 && <div className="" onClick={() => minusHandle(itemId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 opacity-55 hover:opacity-80 cursor-pointer transform duration-500 text-minusButton hover:shadow-2xl shadow-minusButton`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>}
            </label>
            <select
                ref={selection}
                onChange={(e) => {
                    setSelectOption(e.target.value.toString())

                }}
                value={selectOption ? selectOption : chainId.toString()}
                name="chain"
                autoComplete="chain-name"
                className="mt-1 block w-full py-2 px-3 border border-gray-200 cursor-pointer bg-opacity-10 bg-white  rounded-md shadow-sm focus:outline-none focus:ring-minusButton focus:border-minusButton sm:text-sm"
            >
                <option key='1' value="1">Ethereum</option>
                <option key='137' value="137">Polygon</option>
                <option key='56' value="56">BSC</option>
            </select>
        </div>

        <div className="col-span-6 sm:col-span-3">
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                NFT Contract Address
            </label>
            <input
                onChange={(e: any) => {
                    const value = e.target.value
                    debounceInputHandle(value)
                }}
                ref={input}
                type="text"
                name="contract-address"
                autoComplete="off"
                className="mt-1 focus:ring-minusButton focus:border-minusButton block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
            />
            <label></label>
        </div>

        <div className="col-span-6 sm:col-span-3">
            {tokenIds.map((t, i) => (<>

                <TokenInput debounceTokenIdInputHandle={debounceTokenIdInputHandle} index={i}></TokenInput>
            </>))}

        </div>

        <div className="flex">
            <div onClick={addTokenIdInput}>

                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer hover:opacity-90 opacity-65 transform duration-500 hover:shadow-contractBg text-contractBg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            {tokenIds.length !== 1 && <div onClick={removeTokenIdInput}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 opacity-60 ml-4 hover:opacity-90 cursor-pointer transform duration-500 text-minusButton hover:shadow-2xl shadow-minusButton`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

            </div>}
        </div>


    </>
    )
}

export default function AddNftModal(props: any) {
    const [open, setOpen] = useState(false)

    useImperativeHandle(props.onRef, () => {
        return {
            setOpen
        };
    });

    const defaultRowData: Item = { itemId: 1, chainId: 1, contract: "", tokenIds: [""] }
    const [rows, setRows] = useState<Item[]>([defaultRowData])

    useEffect(() => {
        // cache fist 20 items
        const pendingNfts = rows.slice(0, 20)
        sessionStorage.setItem("nfgate.io_addNft", JSON.stringify(pendingNfts))
    }, [rows])

    const newNft = useCallback(() => {
        setRows(r => {
            return [...r, { ...defaultRowData, itemId: r.length + 1 }]
        })
    }, [])

    const clearItemContract = (itemId: number) => {
        setRows(r =>
            r.map(i => {
                if (i.itemId === itemId) {
                    return { ...i, contract: "" }
                }
                return i
            })
        )
        console.log("new rows", rows)
    }

    const updateRows = useCallback((item: Item) => {
        setRows(r =>
            r.map(i => {
                if (i.itemId === item.itemId) {
                    return item
                }
                return i
            })
        )
    }, [])

    const [cancel, setCancel] = useState(false)
    const [isPost, setIsPost] = useState(false)

    const minusHandle = useCallback((itemId: number) => {
        if (rows.length < 2) return
        setRows(r => r.filter(i => i.itemId !== itemId))
    }, [
        rows
    ])

    function checkItem(item: Item) {

        if (!item.chainId) return false
        if (!item.contract) return false
        if (!isAddress(item.contract)) return false
        if (!item.tokenIds || item.tokenIds.filter(t => !!t).length === 0) return false
        return true

    }

    const saveHandle = useCallback(async () => {
        console.log("rows", rows)
        if (!rows || rows.length === 0) return
        if (rows.filter(i => !checkItem(i)).length > 0) return
        maskStore.setIsMask(true)
        await nftListStore.addUserNFT(rows).finally(() => maskStore.setIsMask(false))
    }, [rows])

    return (
        <>
            {loginStore.isSuccess && !!web3Store.account &&
                <>
                    <div className={`space-y-6  mt-10  ${cancel ? "animate__animated animate__hinge" : "animate__animated animate__zoomInLeft animate__delay-0.2s"} ${isPost ? "animate__animated animate__zoomOutUp" : ""}`}>

                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 bg-opacity-25 ">
                            <div className="md:grid md:grid-cols-4 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Add your NFT series</h3>
                                    <p className="mt-1 text-sm text-gray-500">Paste nft contract address here.</p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form action="#" method="POST">


                                        <div className="grid grid-cols-3 gap-6">
                                            {
                                                rows && rows.map((r, i) => (<>
                                                    <Row chainId={r.chainId} contract={r.contract} itemId={r.itemId} minusHandle={minusHandle} updateRows={updateRows} clearItemContract={clearItemContract} />
                                                </>))
                                            }
                                            <div className='mt-5 cursor-pointer' onClick={newNft}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 hover:opacity-90 opacity-55 transform duration-500 hover:shadow-contractBg text-contractBg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => {
                                    setCancel(true)
                                    props.cancel()
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => {
                                    saveHandle()
                                    setIsPost(true)
                                    props.cancel()
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </>
            }
        </>

    )
}