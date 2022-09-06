import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import  { LoginRequestData } from "../store/LoginStore";
import web3Store from "../store/Web3Store";
import copy from "copy-to-clipboard";
import { notification } from "antd";
import { shortAddress} from "../utils/Web3Utils"
interface EvmChainButtonInterface {
  chainId: number;
  clickHandler?: (chainId: number) => void;
}


const EvmChainButton = (porps: EvmChainButtonInterface) => {

  const { chainId, clickHandler } = porps;


  const connectWallet = useCallback(async () => {
    
    await web3Store.initWeb3(chainId);
  }, [web3Store.isConnected, web3Store, chainId]);


  const onclickHandle = useCallback(async () => {
    await connectWallet();
    clickHandler!(chainId);

  }, [chainId, connectWallet]);


  const copyHandle = useCallback(() => {
    copy(web3Store.account)


    notification.info({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      // className: 'custom-class',
      style: {
        width: 600,
        zIndex: 99999
      },
    })
  }, [
    web3Store.account
  ])

  return (<>


    <>
      <div className={`
                
          md:text-xl lg:text-2xl shadow-none hover:shadow-black hover:text-gray-100 hover:shadow-xl hover:text-4xl hover:bg-teal-500 hover:bg-opacity-40 text-gray-300 hover:border-opacity-0
                 
          transform duration-300
            
          pl-10 pr-10 mt-5 bg-gradient-to-r from-contractBg to-clrNeon rounded-full
             `}

        onClick={!web3Store.account ? onclickHandle : copyHandle}
      >


        <div className="">
          <button className=" h-20 w-full ">
            <span className="" style={{ fontFamily: 'BebasNeue-Bold' }}>
            {!web3Store.account ? "Unlock" : shortAddress(web3Store.account)}
            </span>
          </button>
        </div>

      </div>
    </>

  </>
  );
};

export default observer(EvmChainButton);
