import { observer } from "mobx-react-lite";
import styled from '@emotion/styled'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import loginStore from "../store/LoginStore";
import nftListStore from "../store/NftListStore";
import Card from "./Card";
import web3Store from "../store/Web3Store";
import maskStore from "../store/maskStore";
import { Virtuoso } from 'react-virtuoso'

function classNameNames(...classNamees: string[]) {
  return classNamees.filter(Boolean).join(" ");
}

const ListEl = styled.div`
 height: "800px";
  border: 1px solid blue;
  scrollbar-width: none; 
  -ms-overflow-style: none;

  overflow-x: hidden;

  overflow-y: auto;
  &::-webkit-scrollbar {display: none; /* Chrome Safari */};
`

const NFTCollection = (props: any) => {

  const { sendMessage } = props
  const [pageNum, setPageNum] = useState(1)
  const pageSize = 25
  const [listState, setListState] = useState<any[]>([]);

  const listDivRef = useRef(null)
  useLayoutEffect(() => {
    if (!listDivRef.current) return
    const listDiv = document.getElementById("listDiv")
    if (!listDiv) return
    const listDivInner = listDiv.children[0]
    if (!listDivInner) return
    listDivInner.classList.add("hidden_scroll")

  }, [
    listDivRef.current
  ])


  const loadMore = useCallback( () => {
    return setTimeout(async () => {
      const newList  = await nftListStore.getList(pageNum, pageSize).finally(() => { maskStore.setIsMask(false) })
      if(!newList || newList.length === 0) return 
      setPageNum( p => p+1)
      setListState(  (lists) => [...lists, ...newList])
    }, 200)
  }, [setListState, pageNum])

  useEffect(() => {
    if(!loginStore.isSuccess) return
    if(! web3Store.account) return
    setListState([])
    setPageNum(1)
    const timeout = loadMore()
    return () => clearTimeout(timeout)
  }, [loginStore.isSuccess,nftListStore.selectedFilter.contract, web3Store.account])


  return <>
    <style>
      {"@import url('https://fonts.googleapis.com/css2?family=Kolker+Brush&family=Outfit:wght@500&display=swap');"}
      {"@import url('https://fonts.googleapis.com/css2?family=Stalinist+One&display=swap');"}
      {"@import url('https://fonts.googleapis.com/css2?family=Carter+One&display=swap');"}

      {`
          .hidden_scroll {

            scrollbar-width: none !important; /* firefox */
          
            -ms-overflow-style: none !important; /* IE 10+ */
          
            overflow-x: hidden !important;
          
            overflow-y: auto !important;
          
          }

          .hidden_scroll::-webkit-scrollbar {display: none !important; /* Chrome Safari */}
        `}
    </style>
    <div className="w-full mx-auto mt-20" ref={listDivRef} id="listDiv">





      <Virtuoso
        style={{ height: "100vh" }}

        data={listState}
        endReached={loadMore}
        overscan={200}
        itemContent={(index, nft) => <Content nft={nft} sendMessage={sendMessage} key={ nft.nftCode} />}
      />


    </div>
  </>
}


function Content(props: any) {
  const { nft, sendMessage } = props

  return (
    <>
      <div className="relative bg-contain font-card2 mt-20">
        <Card nft={nft} ></Card>

      </div>
    </>
  )
}
export default observer(NFTCollection)