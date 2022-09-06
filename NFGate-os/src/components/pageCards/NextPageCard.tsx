import { MouseEvent, useCallback, useState } from "react";
import { ellipseAddress, ellipseId, getRandomColorString } from "../../utils/Web3Utils"
import CopyButton from "../CopyButton";

const PageCard = (props: any) => {
    const { nft, onClickHandle } = props

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
        // backgroundImage: `url(${url})`,
        boxShadow: `-5px -5px 5px -5px ${colorObj?.color1}, 5px 5px 5px -5px ${colorObj?.color2}, -7px -7px 10px -5px transparent, 7px 7px 10px -5px transparent, 0 0 5px 0px rgba(255, 255, 255, 0), 0 55px 35px -20px rgba(0, 0, 0, 0.5)`

    }



    const onMouseMoveHandle = useCallback((e: any) => {

        var pos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
        e.preventDefault();
        // if (e.type === "touchmove") {
        //     pos = [e.touches![0].clientX, e.touches![0].clientY];
        // }
        var $card = e.currentTarget;
        // math for mouse position
        var l = pos[0] as number;
        var t = pos[1] as number;
        // console.log("e.nativeEvent:", e.nativeEvent)
        var h = e.nativeEvent.target.clientHeight as number;
        var w: number = e.nativeEvent.target.clientWidth as number;
        var px = Math.abs(Math.floor(100 / w * l) - 100);
        var py = Math.abs(Math.floor(100 / h * t) - 100);
        var pa = (50 - px) + (50 - py);
        // math for gradient / background positions
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
        // $style.html(style);
        if (e.type === "touchmove") {
            return false;
        }
        window.clearTimeout(x as NodeJS.Timeout);
    }, [])

    const onMouseOutHandle = useCallback((e: any) => {

        // $style.html("");
        setIsStyle(false)
        const timeoutCount = global.setTimeout(function () {
            setIsAnimated(true)
        }, 500);
        setX(timeoutCount)
    }, [])
    return (

        <>
            <section className="cards" onClick={onClickHandle}>
                <div className={`card ${isActive ? 'active' : ''} ${isAnimated ? 'animated' : ''} pageCard cursor-pointer `} onMouseMove={onMouseMoveHandle} onMouseOut={onMouseOutHandle} style={style}>
                    <div className="text-white text-center items-center justify-center align-bottom block absolute top-1/3 left-1/4">
                        <h1 className="text-6xl">
                            Next
                        </h1>
                        <h1 className="text-4xl">
                            Page
                        </h1>
                    </div>
                </div>
            </section>

            <style className="hover">

                {
                    isStyle ? `
.pageCard:hover:before { background-position: ${lp}% ${tp}%;}  /* gradient */
.pageCard:hover:after {
 background-position: ${pxSpark}% ${pySpark}%; 
 opacity: ${opc / 100};
}   /* sparkles */ 
`: ''
                }
            </style>
        </>



    )
}

export default PageCard