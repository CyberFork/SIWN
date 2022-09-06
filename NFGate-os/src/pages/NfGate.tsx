import {
  createContext,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ChainList from "../components/ChainList";
import NFTCollection from "../components/NFTCollection";
import NFTList from "../components/NFTList";
import { typeOutput } from "../utils/viewUtils";
import "animate.css";
import {
  useLinkClickHandler,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import web3Store from "../store/Web3Store";
import bg1 from "../assets/img/1.jpg";
import bg2 from "../assets/img/2.jpg";
import bg3 from "../assets/img/3.jpg";
import bg4 from "../assets/img/4.jpg";
import bg5 from "../assets/img/5.jpg";
import bg6 from "../assets/img/6.jpg";
import bg7 from "../assets/img/7.jpg";
import bg8 from "../assets/img/8.jpg";
import bg9 from "../assets/img/9.jpg";
import bg10 from "../assets/img/10.jpg";
import maskStore from "../store/maskStore";
import { LoginRequestData } from "../store/LoginStore";
import loginStore from '../store/LoginStore';
import moment from "moment";
import {
  fillParams,
  peelOrigin,
  shortAddress,
  shortAddressLength,
} from "../utils/Web3Utils";
import React from "react";
import { Confirm } from "../components/Modal";
import nftListStore from "../store/NftListStore";
import SubmitButton from "../components/buttons/SubmitButton";
import useLogin from "../hooks/useLogin";
import OrbitronBold from "../assets/font/Orbitron-Bold.ttf";
import OrbitronRegular from "../assets/font/Orbitron-Regular.ttf";
import SearchButtonList from "../components/SearchButtonList";
import NftContractButtonList from "../components/NftContractButtonList";
import metamaskPng from "../assets/MetaMask-Logo.png";
import useWeb3Account from "../hooks/useWeb3Account";
import useMask from "../hooks/useMask";
import useENS from "../hooks/useENS";
import Notifycation from "../components/Notifycation";
import LogoutButton from "../components/buttons/LogoutButton";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export const ChildrenContext = createContext({ randomY3: 0, randomX3: 0 });
export default function User(props: any) {
  const navigate = useNavigate();
  const [stringState, setStringState] = useState("");
  const [isShowChainList, setIsShowChainList] = useState(false);
  const [isShowNFTList, setIsShowNFTList] = useState(false);
  const [isShowNFTCollection, setIsShowNFTCollection] = useState(false);
  const [isStopSpin, setIsStopSpin] = useState(false);
  const [currentChain, setCurrentChain] = useState(0);
  const [requestData, setRequestData] = useState<LoginRequestData>();
  let [searchParams, setSearchParams] = useSearchParams();
  const [targetSource, setTargetSouce] = useState<any>();
  const [origin, setOrigin] = useState<any>();
  let target = searchParams.get("target");

  const logoutHandle = useLogin();
  useMask();

  const ensName = useENS();

  useEffect(() => {
    maskStore.setIsMask(false);

    setTimeout(() => {
      setIsStopSpin(true);
    }, 2000);
    setTimeout(() => {
      setIsShowChainList(true);
    }, 500);
  }, []);

  useMemo(() => {
    sessionStorage.setItem("target", target?.toString() || "");
  }, [target]);

  type SendData = {
    authorizationData: AuthorizationData;
    selectedNftData: SelectedNftData;
  };

  type AuthorizationData = {
    signedData: string;
    signArgs: {
      timestamp: number;
      walletAddress: string;
      target: string | null;
    };
    signTemplate: string;
  };

  type SelectedNftData = {
    unid: string;
    chainName: string;
    chainId: string;
    contract: string;
    tokenId: string;
  };
  const signMsg = useCallback(async () => {
    const timestamp = new Date().getTime();
    const msgSource: string = web3Store.messageToSignOut;
    const walletAddress = web3Store.account;
    const fillText = fillParams(msgSource, {
      timestamp,
      walletAddress,
      target,
    });

    const result = await web3Store.signMsg(fillText);
    setRequestData({
      userAddress: web3Store.account,
      signature: result,
      timestamp: timestamp,
      target: target ?? "",
    });
    const signData: AuthorizationData = {
      signedData: result,
      signArgs: {
        timestamp,
        walletAddress,
        target,
      },
      signTemplate: msgSource,
    };
    console.log("signData:", signData);
    return signData;
  }, [
    web3Store.account,
    web3Store.messageToSignOut,
    maskStore,
    setRequestData,
  ]);

  const [isError, setIsError] = useState(false);

  // Check the origin window has existed
  const [originTimmer, setOriginTimer] = useState<NodeJS.Timeout>();
  const isTest = true;
  useEffect(() => {
    if (isTest) return;

    if (!origin) {
      maskStore.setIsMask(true);
      setOriginTimer(
        setTimeout(() => {
          maskStore.setIsMask(false);
          window.location.href = "https://nfchat.io";
        }, 5000)
      );
    } else {
      clearTimeout(originTimmer as NodeJS.Timeout);
      maskStore.setIsMask(false);
    }
  }, [origin, maskStore.setIsMask]);

  useWeb3Account();

  //nfgate
  const sendMessage = useCallback(async () => {
    console.log("target:", target);
    console.log("origin:", origin);
    if (!target) return;
    if (!origin) return;
    // console.log("targetSource:", targetSource)
    const nftList = await nftListStore.selectedNftList;
    const signDatas = await signMsg();
    const data = { signDatas, selectedNftDataList: nftList };

    console.log("before loginstore.loginlog");
    await loginStore.loginLog(
      nftListStore.getSelectedNftCodeList(),
      signDatas.signArgs.walletAddress,
      signDatas.signedData,
      signDatas.signArgs.timestamp,
      target
    );
    console.log("after loginstore.loginlog");

    const msg = JSON.stringify(data);
    targetSource.postMessage(msg, origin);
  }, [
    origin,
    target,
    targetSource,
    nftListStore.selectedNftList,
    loginStore.loginLog,
    nftListStore.getSelectedNftCodeList,
  ]);

  const sendSuccessMsg = useCallback(
    (_targetSource: any) => {
      const CONNECTSUCCESS_TAG = "NFGate.io: STEP1-connection succeeds.";
      _targetSource.postMessage(CONNECTSUCCESS_TAG, origin);
    },
    [origin]
  );

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const peeledOrigin = peelOrigin(e.origin);

      if (peeledOrigin && peeledOrigin.startsWith(target as string)) {
        setOrigin(e.origin);

        if (e.data === "SIWN: STEP1-Establish connection.")
          sendSuccessMsg(e.source);

        setTargetSouce(e.source);
      }
    });
  }, [target]);

  const outputString: string = `Select your NFTs and sign in to ${target}`;
  const [randomX1, setRandomX1] = useState(0);
  const [randomX2, setRandomX2] = useState(0);
  const [randomX3, setRandomX3] = useState(0);
  const [randomY1, setRandomY1] = useState(0);
  const [randomY2, setRandomY2] = useState(0);
  const [randomY3, setRandomY3] = useState(0);

  useEffect(() => {
    return typeOutput(setStringState, outputString);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRandomX1(Math.floor(Math.random() * 20));
      setRandomX2(Math.floor(Math.random() * 20));
      setRandomX3(Math.floor(Math.random() * 20));
      setRandomY1(Math.floor(Math.random() * 20));
      setRandomY2(Math.floor(Math.random() * 20));
      setRandomY3(Math.floor(Math.random() * 20));
    }, 50);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const clickHandler = useCallback(
    (chainId: number) => {
      setCurrentChain(chainId);
      setIsShowNFTCollection(true);
    },
    [setCurrentChain, setIsShowNFTCollection]
  );

  useEffect(() => {
    if (loginStore.isSuccess && !!web3Store.account) {
      setIsShowNFTCollection(true);
    }else{
      setIsShowNFTCollection(false);
    }
  }, [loginStore.isSuccess, web3Store.account]);

  useEffect(() => {
    console.log("currentChain", currentChain);
  }, [currentChain]);

  const [nftContractAddress, setNftContractAddress] = useState("");

  const collectionClickHandle = useCallback(
    (address: string) => {
      setNftContractAddress(address);

      setIsShowNFTList(true);
    },
    [setNftContractAddress, setIsShowNFTList]
  );

  const [bgUrl, setBgUrl] = useState(bg1);
  const [bgUrl2, setBgUrl2] = useState(bg2);
  const [imgs, setImgs] = useState([
    bg2,
    bg3,
    bg4,
    bg5,
    bg6,
    bg7,
    bg8,
    bg9,
    bg10,
    bg1,
  ]);
  const [imgIndex, setImgIndex] = useState(0);
  const [isOrder12, setIsOrder12] = useState(true);
  const [duration, setDuration] = useState(15000);
  const [delay, setDelay] = useState(100);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const changeImg = useCallback(
    (d: any) => {
      setTimeout(() => {
        setBgUrl(imgs[imgIndex]);

        setImgIndex((c) => c + 1);
        if (imgIndex == imgs.length - 1) {
          setImgIndex(0);
        }

        setTimeout(setFadeInOrFadeOut, duration * 0.75);
      }, d * 0.75);

      if (d > 0)
        setTimer(
          setInterval(function () {
            changeImg(0);
          }, duration)
        );
    },
    [imgs, imgIndex, duration, delay]
  );

  const setFadeInOrFadeOut = useCallback(() => {
    setIsOrder12((f) => !f);
    console.log("isOrder12:", isOrder12);
    // set a next background image
    setBgUrl2(imgs[imgIndex + 1]);
    console.log("change fadeIn:", moment().format("HH:mm:ss"));
  }, [isOrder12, imgIndex]);
  useEffect(() => {
    setFadeInOrFadeOut();
    changeImg(duration);
    console.log("timer:", timer);
    return () => {
      window.clearInterval(timer as NodeJS.Timeout);
    };
  }, [duration]);

  let ChildRef = React.createRef<any>();

  const setVisible = () => {
    ChildRef.current.setOpen(true);
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
  }, [audioRef.current]);
  //

  const [nftLoaded, setnftLoaded] = useState(false);
  useEffect(() => {
    if (nftListStore.nftList && nftListStore.nftList.length > 0) {
      setnftLoaded(true);
    }
  }, [nftListStore.nftList]);

  const [isLogoutButtonShown, setIsLogoutButtonShown] = useState(false);
  return (
    <div className="min-h-full">
      <style>
        {` 
          
          @keyframes scaleDrawWithoutRotate {
            
            0% {
                 
                 transform: scale3d(2.5, 2.5, 2.5);
             }
           
             25% {
               transform: scale3d(1.25, 1.25, 1.25);
             }
             
             50% {
               transform: scale3d(2.5, 2.5, 2.5);
             }
             
             75% {
               transform: scale3d(1.25, 1.25, 1.25);
             }
           
             100% {
               transform: scale3d(2.5, 2.5, 2.5);
             }
           
           }
             
           
              #bg-img{
               width: 100%;
               height: 100%;
               display: flex;
               overflow: hidden;
              }
                   .base-img-body {
                     width: 100vw;
                    height: 100vh;
                    position: fixed;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                    background-size: cover !important;
                    
                   }  

        #img-body {
         background-image: url(${bgUrl});
         opacity: 0;
         transition: opacity 6s;
         transition-delay: ${delay}ms;
         transition-duration: ${duration - delay}ms;

       
      }
        #img-body2 {  
         background-image: url(${bgUrl2});
         opacity: 0;
         transition: opacity 6s;
         transition-delay: ${delay}ms;
         transition-duration: ${duration - delay}ms; 
      }
      
      #img-body.fadeIn {
        opacity: 1;
      }
      
      #img-body2.fadeIn {
        opacity: 1;
      }

      .bg_scale{
        animation-name: scaleDrawWithoutRotate;
        animation-timing-function: ease-in;
       animation-iteration-count: infinite;
       animation-duration: ${16 * imgs.length}s;
      }
   
      `}

        {`
          .hidden_scroll_x {

            scrollbar-width: none !important; /* firefox */
          
            -ms-overflow-style: none !important; /* IE 10+ */
          
            overflow-x: hidden !important;
          
            overflow-y: auto !important;
          
          }

          .hidden_scroll::-webkit-scrollbar {display: none !important; /* Chrome Safari */}
        `}
      </style>

      <main className="py-10 hidden_scroll_x">
        <div id="bg-img">
          <div
            id="img-body"
            className={`bg_scale base-img-body m-0 p-0 w-full h-full ${
              isOrder12 ? "fadeIn" : ""
            } z-0`}
          />

          <div
            id="img-body2"
            className={`bg_scale base-img-body m-0 p-0 w-full h-full ${
              !isOrder12 ? "fadeIn" : ""
            } z-0`}
          />
        </div>

        <div className="flex max-w-3xl mx-auto lg:max-w-7xl lg:px-8 relative left-7  ">
          <img
            className={`relative top-10 h-14 w-auto rounded-full ${
              isStopSpin ? "" : "animate-spin"
            }`}
            src={metamaskPng}
          />
          <button
            type="button"
            className="rounded-r-lg rounded-t-lg mx-4 py-2 px-4 group text-gray-500 border-clrNeon group shadow-md shadow-gray-700 bg-white  inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-expanded="false"
          >
            <span id="myDiv" className="animate__pulse">
              {stringState}
            </span>
          </button>
        </div>

        {/* bg-contain */}
        <div className="max-w-8xl mx-auto grid grid-cols-1 gap-20 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 sm:col-start-3 lg:col-start-1 sm:col-span-1 lg:col-span-3 ">
            <div
              onMouseEnter={() => setIsLogoutButtonShown(true)}
              onMouseLeave={() => setIsLogoutButtonShown(false)}
              className={`bg-banner  bg-cover  bg-no-repeat lg:h-60  md:h-40 sm:h-20 w-full z-40 relative ${
                !web3Store.account ? "opacity-25" : ""
              }`}
            >
              <div className="pt-20 pl-80">
                <style>
                  {`@font-face{

                  font-family: Orbitron-Bold;
                  src: url(${OrbitronBold}); 
                }
                
                @font-face{

                  font-family: Orbitron-Regular;
                  src: url(${OrbitronRegular}); 
                }
              
                
                `}
                </style>

                <>
                  {!!ensName && (
                    <h1
                      className="-ml-10 md:text-xl mt-1.5 lg:text-4xl font-bold text-zinc-500"
                      style={{ fontFamily: "Orbitron-Bold" }}
                    >
                      {ensName}
                    </h1>
                  )}
                  {!!web3Store.account && (
                    <>
                      <h2
                        className={`mt-3 text-black font-bold  ${
                          !!ensName ? "lg:text-2xl" : "lg:text-4xl"
                        }`}
                        style={{ fontFamily: "Orbitron-Regular" }}
                      >
                        {shortAddressLength(web3Store.account, 6)}
                      </h2>
                      <div
                        className={`${
                          isLogoutButtonShown ? "opacity-100" : "opacity-25"
                        } delay-200 duration-500`}
                      >
                        {/* <div>123</div> */}
                        <LogoutButton logoutHandle={logoutHandle} />
                      </div>
                    </>
                  )}
                </>
              </div>
            </div>
            {!web3Store.account ? (
              <div className="lg:mt-5 md:-mt-10 sm:-mt-15 -mt-15">
                <ChainList clickHandler={clickHandler} />
              </div>
            ) : (
              <>
                <Notifycation></Notifycation>
                <SearchButtonList></SearchButtonList>
                <NftContractButtonList />
              </>
            )}

            <div
              className={`w-full absolute h-5 text-center justify-center items-center  ${
                isShowNFTCollection
                  ? "animate__animated animate__rollIn"
                  : "hidden"
              } z-50`}
            >
              <SubmitButton
                clickHandle={setVisible}
                target={target}
              ></SubmitButton>
              <Confirm sure={sendMessage} onRef={ChildRef} />
            </div>
          </div>
        </div>
      </main>
     
        <div
        className={`duration-1000 relative  shadow sm:rounded-lg  transform-gpu justify-center items-center ${
          isShowNFTCollection
            ? "animate__animated animate__rotateInDownLeft"
            : "hidden"
        }  pt-20`}
      >
        <NFTCollection
          chainId={currentChain}
          collectionClickHandle={collectionClickHandle}
        />
      </div>
    </div>
  );
}
