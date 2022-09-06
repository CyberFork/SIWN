import { notification } from "antd"
import { useEffect, useState } from "react"
import nftListStore from "../store/NftListStore"



const useNotifycation = () => {
  const [msg, setMsg] = useState<any[]>([{msgId: 1, msg: "", isSuccess: false, param: { tokenId: "", address: "", chainId: 1}}])
  
  
  useEffect(() => {
    console.log("nftListStore.addNftMessages:", nftListStore.addNftMessages)
    if(!nftListStore || !nftListStore.addNftMessages || nftListStore.addNftMessages.length === 0) return 
    // notification.open({
    //   message: 'Notification Title',
    //   description:
    //     'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    //   onClick: () => {
    //     console.log('Notification Clicked!');
    //   },
    //   className: "relative"
    // });
   
    setMsg( m => [...m,  ...nftListStore.addNftMessages.map(i => {
      return { 
        msgId: m[m.length - 1 ].msgId + 1, 
        msg: i.msg,
        isSuccess: i.msg !== "You are not owner of this NFT",
        param:{tokenId: i.tokenId, address: i.address, chainId: i.chainId}}})])
  }, [
    nftListStore.addNftMessages
  ])


  return msg
}

export default useNotifycation


