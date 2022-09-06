import BebasNeueBold from "../assets/font/BebasNeue-Bold.otf"
import corner from "../assets/banner/button_corner.png"
import { useCallback, useEffect, useState } from "react"
import nftListStore from "../store/NftListStore"
import web3Store from "../store/Web3Store"
import AddNftModal  from "./AddNftModal"
import loginStore from "../store/LoginStore"

const SearchButton = (props: any) => {

  const [isSelect, setIsSelect] = useState(false)
  const { chainId, chainName, isLast } = props


  const onClickHandle = useCallback(() => {
    setIsSelect(f => {
      if (!f) {
        nftListStore.clearContractFilter()
        nftListStore.addSelectedFilter({ chainId: chainId })
      } else {
        nftListStore.clearContractFilter()
        nftListStore.removeSelectedFilter({ chainId: chainId })
      }

      return !f
    })

  }, [])

  useEffect(()=>{
    if(!web3Store.account) return 
    setIsSelect(false)
  },[
    web3Store.account
  ])

  return (
    <>
      <div className={`
                ${isSelect
          ?
          'shadow-inner shadow-slate-700 md:text-2xl lg:text-4xl text-gray-500 bg-teal-500 bg-opacity-60'
          :
          'md:text-4xl lg:text-5xl shadow-none hover:shadow-slate-600 hover:text-gray-100 hover:shadow-xl hover:text-6xl hover:bg-teal-500 hover:bg-opacity-40 text-gray-300 hover:border-opacity-0'
        }
              
                 
             transform duration-200
             border-gray-400  border-r-5 border-opacity-25
            flex-col justify-center items-center place-items-center
             
             `}

        onClick={onClickHandle}
      >




        <button className=" h-20 w-full pt-5">
          <span className="" style={{ fontFamily: 'BebasNeue-Bold' }}>
            {chainName}
          </span>
        </button>

        <img src={corner} className="absolute -left-3 -top-3" ></img>
        <img src={corner} className="absolute -left-3 -bottom-3"></img>
        {
          isLast && <>
            <img src={corner} className="absolute -right-3 -top-3" ></img>
            <img src={corner} className="absolute -right-3 -bottom-3"></img>
          </>
        }
      </div>
    </>
  )
}


const SearchButtonList = (props: any) => {


  // If the account has changed
  useEffect(()=>{
    if(!web3Store.account) return 
    nftListStore.clearFilter()
  },[
    web3Store.account
  ])

  const [open, setOpen] = useState(false)

  const setVisible  =  useCallback(()=>{
    
    if(!loginStore.isSuccess) return
    if(!web3Store.account) return 
    setOpen(true)
  },[
    loginStore.isSuccess, web3Store.account
  ])



  return (
    <>
      {/* search input start*/}
      <div className="relative pr-18 pl-15">
        <style>
          {`
                      @font-face{

                        font-family: BebasNeue-Bold;
                        src: url(${BebasNeueBold}); 
                      }

                  `}
        </style>
        {/* search button list*/}
        <div className="grid grid-cols-4 gap-0 w-full border-collapse border-5 border-gray-400 border-opacity-25 bg-black bg-opacity-25">

          <SearchButton chainId={1} chainName="Ethereum"></SearchButton>

          {/* search button hover:shadow-inner*/}
          <SearchButton chainId={137} chainName="Polygon"></SearchButton>
          <SearchButton chainId={56} chainName="BSC"></SearchButton>

          <div className="hover:shadow-xl  text-gray-500 hover:text-white duration-500  md:text-4xl lg:text-5xl" onClick={setVisible}>
            <div className="flex justify-between -ml-2.5 -mt-2.5 -mr-2.5">
              <img src={corner} className=""></img>
              <img src={corner} className=""></img>
            </div>


            <div className="border-img">
              <button className=" h-20 w-full ">
                <span className="" style={{ fontFamily: 'BebasNeue-Bold' }}>
                  Add Your NFT
                </span>
              </button>
            </div>

            <div className="flex justify-between -ml-2.5 -mb-3 -mr-2.5">
              <img src={corner} className=""></img>
              <img src={corner} className=""></img>
            </div>
          </div>
        </div>


        {open && <AddNftModal sure={()=>{alert("AddNftModal")}} cancel={()=>{setTimeout(() => {
          setOpen(false)  
        }, 2000);}} />} 

      </div>

      {/* search input end*/}
    </>
  )
}

export default SearchButtonList