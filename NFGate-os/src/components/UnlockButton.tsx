import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import loginStore, { LoginRequestData } from "../store/LoginStore";
import maskStore from "../store/maskStore";
import web3Store from "../store/Web3Store";
import {SUPPORT_EVM_CHAINS, CHAINID_TO_CHAININFOS} from "../constant/chains"
import moment from 'moment';
import {fillParams} from "../utils/Web3Utils"

interface EvmChainButtonInterface {
  chainId: number;
  clickHandler?: (chainId: number) => void;
}


const EvmChainButton = (porps: EvmChainButtonInterface) => {

  const { chainId, clickHandler } = porps;
  const target = sessionStorage.getItem("target")?.toString()
  const [requestData, setRequestData] = useState<LoginRequestData>();
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [signText, setSignText] = useState("");

  useEffect( () => {
    if(loginStore.signText){
      setSignText(loginStore.signText)
    }

  }, [loginStore.signText])

  useMemo(async () => {
  
    if (isLoginSuccessful) return;
    if (!requestData) return;

    await loginStore.login(requestData);
    setIsLoginSuccessful(loginStore.isSuccess);
  }, [
    requestData,
    loginStore.login,
    isLoginSuccessful,
    setIsLoginSuccessful,
  ]);

  const connectWallet = useCallback(async () => {
    //if (web3Store.isConnected) return
    await web3Store.initWeb3(chainId);
  }, [web3Store.isConnected, web3Store, chainId]);

  const signMsg = useCallback(async () => {
    // const text  = await loginStore.getSignText()
    const text  = web3Store.messageToSignInner
    console.log("sign text is ", text)
    const timestamp = new Date().getTime()
    // const msgSource: string = `I want to authenticate with nfgate.io and generate a JWT token at timestamp - ${timestamp} to prove that I am the owner of the following wallet address: ${web3Store.account} to select NFT to login ${target}. Signature transactions do not affect your assets in any way.`;
    const fillText = fillParams(text, {timestamp, "walletAddress": web3Store.account, "target": target})
    console.log("fillText:", fillText)
    const result = await web3Store.signMsg(fillText);
    setRequestData({userAddress: web3Store.account, signature: result, timestamp: timestamp, target: target??''});
    console.log("result", result);
    console.log("getIsMask()", maskStore.getIsMask());
  }, [web3Store,  maskStore, setRequestData]);

  const onclickHandle = useCallback(async () => {
    await connectWallet();
    clickHandler!(chainId);

    setTimeout(async () => {
      await signMsg();
    }, 300);
  }, [chainId, connectWallet, signMsg]);
  
  return (<>
      <button
        type="button"
        onClick={onclickHandle}
        className={`${CHAINID_TO_CHAININFOS[chainId].tailwindcss}`}
        aria-expanded="false"
      >
        <span>WalletUnlock</span>

        {/* <svg
          className="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg> */}
      </button>
    </> 
  );
};

export default observer(EvmChainButton);
