import { useCallback, useEffect, useState } from "react"
import nftListStore from "../../store/NftListStore"

const SubmitButton  = (props: any) => {
    const {clickHandle, target}  = props
    const [clrNeon, setClrNeon] = useState('hsl(317 100% 54%)')
    const [clrBg, setClrBg] = useState('hsl(323 21% 16%)')
    const [hasSelected, setHasSelected]  = useState(false)
    const [isTada, setIsTada] = useState(false)
    
    useEffect(()=>{
        if(nftListStore.selectedNftList.length > 0) {
            setHasSelected(true)
        }else{
            setHasSelected(false)
        }
    },[nftListStore.selectedNftList.length])


    const innerClickHandle = useCallback(()=>{
        
        if(!hasSelected) {
            setIsTada(true)
            setTimeout(() => setIsTada(false), 1000)
        }else{
            clickHandle()
        }
    },[
        clickHandle, hasSelected, nftListStore.selectedNftList.length
    ])
    return (<>
    <div className={`absolute grid place-content-centerpt-1 pb-1 pl-5 pr-5 mt-15 ${ isTada  ? 'animate__animated animate__tada': ''}` }>
        <button className="neon-button bg-clrBg" onClick={innerClickHandle}>
            {/* Sign in with NFTs to {target}{' (SIWN)'}  */}
            Sign in {target}{' (SIWN)'} 
        </button>
    </div>
    <style>
        {`
            .neon-button {
                font-size: 2rem;
                display: inline-block;
                cursor: poiner;
                text-decoration: none;
                color: ${clrNeon};
                border: currentColor .125em solid;
                padding: .25em 1em;
                border-radius: .25em;

                text-shadow: 0 0 .125em hls(0 0% 100% / 0.3), 0 0 .45em currentColor;
                box-shadow: inset 0 0 .5em 0 ${clrNeon}, 0 0 .5em  0 ${clrNeon};

                position: relative;
            }

            .neon-button::before {
                content: "";
                position: absolute;
                background: ${clrBg};
                top: 120%;
                left: 0;
                width: 100%;
                height: 50%;

                transform: perspective(1em) rotateX(40deg) scale(1 0.35);
                filter: blur(2em);
            }
        `}
    </style>
    </>)
}

export default SubmitButton