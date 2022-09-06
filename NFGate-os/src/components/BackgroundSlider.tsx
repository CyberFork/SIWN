import { useState, useEffect } from "react"

const BackgroundSlider = (props: any) => {

    const { imgs } = props
    const [fadeIn, setFadeIn] = useState(4000)
    const [fadeOut, setFadeOut] = useState(1000)
    const [isStop, setIsStop] = useState(false)

    const [number, setNumber] = useState(0)

    useEffect(() => {
        if (imgs.length == 0) return
        console.log("imgs:", imgs)
        
    }
        , [imgs])

    return (
        <>
            {imgs.length > 0 ?
                imgs.map((item: any, index: number) => (
                    <>
                        <div id={`imageId${index}`} className={`img_animated ${number === index ? 'visible' : 'invisible'}`} style={{ backgroundImage: imgs[index] }}>
                        </div>

                    </>

                ))
                : <></>}
            <style>
                {`
                    @keyframes scaleDraw {
            
                        from {
                            opacity: 0.5;
                            transform: scale3d(5, 5, 5)
                        }
            
                        to {
                            opacity: 1;
                            transform: scale3d(1, 1, 1);
            
                        }
            
                    }


                    img_animated {

                        animation-name: scaleDraw;
                        animation-timing-function: ease-in-out;
                        animation-iteration-count: infinite;
                        animation-duration: 36s;
                    }
                `}
            </style>
        </>


    )
}

export default BackgroundSlider