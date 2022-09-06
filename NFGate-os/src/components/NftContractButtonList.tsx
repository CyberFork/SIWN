import BebasNeueBold from "../assets/font/BebasNeue-Bold.otf"
import corner from "../assets/banner/button_corner.png"
import { useCallback, useEffect, useState } from "react"
import nftListStore from "../store/NftListStore"
import loginStore from "../store/LoginStore"
import web3Store from "../store/Web3Store"
import { NftContract } from "../store/NftListStore"
import { shortName } from "../utils/Web3Utils"
import maskStore from "../store/maskStore"

const NftContractButton = ({ nft, isLast,setList, list }: { nft: NftContract, isLast: boolean, setList: any, list: string[] | null }) => {

  const [isSelect, setIsSelect] = useState(false)


  const onClickHandle = useCallback(() => {
    maskStore.setIsMask(true)
    setIsSelect(f => {
      if (!f) {
        nftListStore.addSelectedFilter({ contract: nft.nftAddress })

        if (list) {
          setList(Array.from(new Set([...list, nft.nftAddress.toUpperCase()])))
        }
        else {
          setList([nft.nftAddress.toUpperCase()])
        }
      } else {

        if (list) {
          setList(list.filter(i => {
            return i.toUpperCase() !== nft.nftAddress?.toUpperCase()
          }))

        }

      }

      return !f
    })

  }, [list])

  return (
    <>
      <div className={`
                 ${isSelect
          ?
          'shadow-inner shadow-slate-700 md:text-2xl lg:text-4xl text-gray-500 bg-teal-500 bg-opacity-60'
          :
          'md:text-xl lg:text-2xl shadow-none hover:shadow-slate-600 hover:text-gray-100 hover:shadow-xl hover:text-4xl hover:bg-teal-500 hover:bg-opacity-40 text-gray-300 hover:border-opacity-0'

        }
              
                 
             transform duration-300
             border-gray-400  border-l-5 border-t-5 border-b-5 border-opacity-25 ${isLast ? 'border-r-5' : ''}
            pl-10 pr-10 mt-5
             `}

        onClick={onClickHandle}
      >

        <img src={corner} className="absolute -left-3 -top-3" ></img>
        <img src={corner} className="absolute -left-3 -bottom-3"></img>
        {
          isLast && <>
            <img src={corner} className="absolute -right-3 -top-3" ></img>
            <img src={corner} className="absolute -right-3 -bottom-3"></img>
          </>
        }


        <div className="">
          <button className=" h-20 w-full">
            <span className="" style={{ fontFamily: 'BebasNeue-Bold' }}>
              {shortName(nft.symbol, 4)}
            </span>
          </button>
        </div>

      </div>
    </>
  )
}


const NftContractButtonList = (props: any) => {
  const [selectList, setSelectList] = useState<string[] | null>(null)

  useEffect(() => {
    if (selectList) {
      nftListStore.setSelectedFilterContrat(selectList)
    }

  }, [selectList])


  useEffect(() => {
    if (!web3Store.account) return
    if (!loginStore.isSuccess) return
    maskStore.setIsMask(true)
    nftListStore.getUserNonFungibleTokenDescription().finally(() => {
      maskStore.setIsMask(false)
    })

  }, [nftListStore.selectedFilter.chainId, loginStore.isSuccess, web3Store.account])


  const [selectArray, setSelectArray] = useState<string[]>([])
  useEffect(() => {
    if (nftListStore.selectedFilter.contract && nftListStore.selectedFilter.contract.length > 0) {
      setSelectArray(nftListStore.selectedFilter.contract)
    }
  }, [nftListStore.selectedFilter.contract])


  const [contractGroups, setContractGroups] = useState<any>([])


  function group(array: NftContract[], subGroupLength: number) {
    let index = 0;
    let newArray = [];

    while (index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
  }


  useEffect(() => {
    if (!loginStore.isSuccess) return
    if (!nftListStore.userNftContracts) return
    setSelectList(null)
    const contractGroup = group(nftListStore.userNftContracts, 5)
    console.log("contractGroup:", contractGroup)
    setContractGroups(contractGroup)

  }, [
    loginStore.isSuccess, nftListStore.userNftContracts
  ])


  return (
    <>

      {loginStore.isSuccess && <div className="relative pr-18 pl-15 ">
        <style>
          {`
                      @font-face{

                        font-family: BebasNeue-Bold;
                        src: url(${BebasNeueBold}); 
                      }

                  `}
        </style>
        {contractGroups && contractGroups.length > 0 && contractGroups.map((g: NftContract[], i: number) => (
          <>
            <div className="grid grid-cols-5  ">
              {g?.map((n, i) => {
                return <>
                
                  <NftContractButton nft={n} isLast={i + 1 === g.length} setList={setSelectList} list={selectList}></NftContractButton>

                </>
              }

              )}
            </div>
          </>
        ))}



      </div>
      }
    </>
  )
}

export default NftContractButtonList