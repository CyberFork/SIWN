import { useEffect } from "react";
import { useCallback, useState } from "react";
import nftListStore from "../store/NftListStore";
import { ellipseAddress, ellipseId } from "../utils/Web3Utils"
import CopyButton from "./CopyButton";
import { notification } from "antd";

const Card = (props: any) => {
    const { nft, doubleClick } = props
    const id = nft.nftCode
    const url = nft.imageUrl
    const [ty, setTy] = useState(0)
    const [tx, setTx] = useState(0)
    const [lp, setLp] = useState(0)
    const [tp, setTp] = useState(0)
    const [pxSpark, setPxSpark] = useState(0)
    const [pySpark, setPySpark] = useState(0)
    const [opc, setOpc] = useState(0)

    const [isStyle, setIsStyle] = useState(true)
    const [isActive, setIsActive] = useState(true)
    const [isAnimated, setIsAnimated] = useState(true)


    const getRandomColor = () => {
        return Math.floor(Math.random() * 255)
    }
    const getRandomColorString = () => {
        return `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`
    }
    const [x, setX] = useState<NodeJS.Timeout>()

    const [colorObj, setColorObj] = useState<{ color1: string, color2: string, color3: string, color4: string }>(
        { color1: getRandomColorString(), color2: getRandomColorString(), color3: getRandomColorString(), color4: getRandomColorString() }
    )


    const style = {
        transform: `rotateX(${ty}deg) rotateY(${tx}deg)`,
        backgroundImage: `url(${url})`,
        boxShadow: `-5px -5px 5px -5px ${colorObj?.color1}, 5px 5px 5px -5px ${colorObj?.color2}, -7px -7px 10px -5px transparent, 7px 7px 10px -5px transparent, 0 0 5px 0px rgba(255, 255, 255, 0), 0 55px 35px -20px rgba(0, 0, 0, 0.5)`

    }

    const onTouchMoveHandle = (e: TouchEvent) => {
        console.log("onTouchMoveHandle e:", e)
    }

    const onMouseMoveHandle = useCallback((e: any) => {

        var pos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
        e.preventDefault();
        var l = pos[0] as number;
        var t = pos[1] as number;
        var h = e.nativeEvent.target.clientHeight as number;
        var w: number = e.nativeEvent.target.clientWidth as number;
        var px = Math.abs(Math.floor(100 / w * l) - 100);
        var py = Math.abs(Math.floor(100 / h * t) - 100);
        var pa = (50 - px) + (50 - py);
        var lp = (50 + (px - 50) / 1.5);
        var tp = (50 + (py - 50) / 1.5);

        var pxSpark = (50 + (px - 50) / 7);
        var pySpark = (50 + (py - 50) / 7);
        var opc = 20 + (Math.abs(pa) * 1.5);
        var ty = ((tp - 50) / 2) * -1;
        var tx = ((lp - 50) / 1.5) * .5;
        setPxSpark(pxSpark)
        setPySpark(pySpark)
        setOpc(opc)
        setTx(tx)
        setTy(ty)
        setLp(lp)
        setTp(tp)

        setIsActive(false)
        setIsAnimated(false)
        setIsStyle(true)
        if (e.type === "touchmove") {
            return false;
        }
        window.clearTimeout(x as NodeJS.Timeout);
    }, [])

    const onMouseOutHandle = useCallback((e: any) => {

        setIsStyle(false)
        const timeoutCount = global.setTimeout(function () {
            setIsAnimated(true)
        }, 500);
        setX(timeoutCount)
    }, [])

    const [isSelected, setIsSelected] = useState(false)
    const [init, setInit] = useState(true)
    const [isLimit, steIslimit] = useState(false)

    const onClickHandle = useCallback(() => {
        if (isLimit) return
        if (nftListStore.selectedNftList.length >= 10 && !isSelected) {

            // notification.open({
            //     message: '10 NFTs limit',
            //     description:
            //         'This is a temporary decision and more NFTs will be allowed in the future',
            //     // className: 'custom-class',
            //     style: {
            //         width: 600,
            //     },
            // });
            steIslimit(true)
            setTimeout(() => steIslimit(false), 1100)
        } else {
            setIsSelected(s => !s)
        }
    }, [isSelected, nftListStore, nft])

    useEffect(() => {
        if (init) {
            setInit(false)
            return
        }

        isSelected ?
            nftListStore.addSelectedNft({ unid: `${nft.chainName}-${nft.chainId}-${nft.nftAddress}-${nft.tokenId}`, chainName: nft.chainName, chainId: nft.chainId, contract: nft.nftAddress, tokenId: nft.tokenId, nftCode: nft.nftCode })
            :
            nftListStore.removeSelectedNft(`${nft.chainName}-${nft.chainId}-${nft.nftAddress}-${nft.tokenId}`)

    }, [isSelected, init])
    
    return (
        <>
            <section className={`cards ${isSelected ? `opacity-100` : 'opacity-55'}   ${isSelected ? 'hover:opacity-100' : 'hover:opacity-95'} hover:scale-110  hover:duration-500 duration-500  ${isSelected ? 'animate-bounce z-10' : ''} ${isLimit ? 'animate__animated animate__tada' : ''}`} onClick={onClickHandle} >
                <div className={`card ${isActive ? 'active' : ''} ${isAnimated ? 'animated' : ''} item${id} cursor-pointer ${isSelected ? 'border-2 border-clrNeon' : ''}  pointer-events-auto`} onMouseMove={onMouseMoveHandle} onMouseOut={onMouseOutHandle} onTouchMove={() => onTouchMoveHandle} style={style} >
                    <div className="w-full h-20 absolute z-40" onClick={(e)=>{e.preventDefault()}}>
                        <div className="text-white ml-3 mt-2  sm:text-sm md:text-md lg:text-md ">
                            Address: {ellipseAddress(nft.nftAddress)}
                             <CopyButton text={nft.nftAddress} />
                            
                        </div>
                        <div className="text-white ml-3 mt-2  text-lg">
                            ID: {ellipseId(nft.tokenId)}
                                <CopyButton text={nft.tokenId} />
                        </div>
                    </div>
                    <div className="text-white  absolute bottom-12 left-2 text-2xl ">
                        {nft.name}
                    </div>
                    <div className="text-white  absolute bottom-5 right-2 text-4xl">
                        {nft.symbol}
                    </div>

                </div>
            </section>
            <style >

                {`.item${id}:hover {
          box-shadow: -20px -20px 30px -25px ${colorObj?.color1}, 20px 20px 30px -25px ${colorObj?.color2}, -7px -7px 10px -5px ${colorObj?.color1}, 7px 7px 10px -5px ${colorObj?.color2}, 0 0 13px 4px rgba(255, 255, 255, 0.3), 0 55px 35px -20px rgba(0, 0, 0, 0.5);
}`}

                {
                    `.item${id}:before {
             background-image: linear-gradient(115deg, transparent 0%, ${colorObj?.color1} 25%, transparent 47%, transparent 53%, ${colorObj?.color2} 75%, transparent 100%);
             content:'Token Name: OtherSide';
            }
            `
                }
                {
                    `
  .item${id}.active:before, .item${id}:hover:before {
    background-image: linear-gradient(110deg, transparent 25%, ${colorObj?.color1} 48%, ${colorObj?.color2} 52%, transparent 75%);
}
  `
                }

                {
                    isStyle ? `
              .item${id}:hover:before { background-position: ${lp}% ${tp}%;}  /* gradient */
              .item${id}:hover:after {
                 background-position: ${pxSpark}% ${pySpark}%; 
                 opacity: ${opc / 100};
            }   /* sparkles */ 
            `: ''
                }
            </style>
        </>



    )
}

export default Card