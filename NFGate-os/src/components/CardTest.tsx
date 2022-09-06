import { MouseEvent, useCallback, useState } from "react";

const Card = (props: any) => {
  const { url } = props

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

  const [colorObj, setColorObj] = useState<{color1: string, color2: string}>(
    { color1: getRandomColorString(), color2: getRandomColorString() }
  )


  const style = isStyle ? {
    transform: `rotateX(${ty}deg) rotateY(${tx}deg)`
  } : {}
  const onMouseMoveHandle = useCallback((e: MouseEvent) => {
    // console.log("e:", e)
    // console.log("type of e:", typeof e)
    // var $style = e.currentTarget
    // normalise touch/mouse
    var pos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    e.preventDefault();
    // if (e.type === "touchmove") {
    //     pos = [e.touches![0].clientX, e.touches![0].clientY];
    // }
    var $card = e.currentTarget;
    // math for mouse position
    var l = pos[0] as number;
    var t = pos[1] as number;
    var h = e.nativeEvent.pageY as number;
    var w: number = e.nativeEvent.pageX as number;
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
    // css to apply for active card
    // var grad_pos = `background-position: ${lp}% ${tp}%;`
    // var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
    // var opc = `opacity: ${p_opc / 100};`
    // var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
    // need to use a <style> tag for psuedo elements
    //         var style = `
    // .card:hover:before { ${grad_pos} }  /* gradient */
    // .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
    // `
    // set / apply css class and style
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
      <section className="cards">

        {/* <div className={`card charizard ${isActive ?? `active `} ${isAnimated ?? `animated`}`} onMouseMove={haha} onMouseOut={hehe} style={style}></div> */}
        <div className={`card ${isActive ? 'active' : ''} ${isAnimated ? 'animated' : ''}`} onMouseMove={onMouseMoveHandle} onMouseOut={onMouseOutHandle} style={style}></div>
        {/* <div className={`card pika ${isActive??`active `} ${isAnimated??`animated`}`} onMouseMove={haha} onMouseOut={hehe } style={style}></div>
            <div className={`card eevee ${isActive??`active `} ${isAnimated??`animated`}`} onMouseMove={haha} onMouseOut={hehe } style={style}></div>
          <div className={`card mewtwo ${isActive??`active `} ${isAnimated??`animated`}`} onMouseMove={haha} onMouseOut={hehe } style={style}></div> */}

      </section>
      <style className="hover">
        {`.card { 
        background-image: url(${url});
        box-shadow: -5px -5px 5px -5px ${colorObj?.color1}, 5px 5px 5px -5px${colorObj?.color2}, -7px -7px 10px -5px transparent, 7px 7px 10px -5px transparent, 0 0 5px 0px rgba(255, 255, 255, 0), 0 55px 35px -20px rgba(0, 0, 0, 0.5);
        }`}

        {`.card:hover {
          box - shadow: -20px -20px 30px -25px ${colorObj?.color1}, 20px 20px 30px -25px ${colorObj?.color2}, -7px -7px 10px -5px ${colorObj?.color1}, 7px 7px 10px -5px ${colorObj?.color2}, 0 0 13px 4px rgba(255, 255, 255, 0.3), 0 55px 35px -20px rgba(0, 0, 0, 0.5);
}`}

        {
          `.card:before { background-image: linear-gradient(115deg, transparent 0%, ${colorObj?.color1} 25%, transparent 47%, transparent 53%, ${colorObj?.color2} 75%, transparent 100%);}`
        }
        {
          `
  .card.active:before, .card:hover:before {
    background-image: linear-gradient(110deg, transparent 25%, ${colorObj?.color1} 48%, ${colorObj?.color2} 52%, transparent 75%);
}
  `
        }

        {
          isStyle ? `
              .card:hover:before { background-position: ${lp}% ${tp}%;}  /* gradient */
              .card:hover:after { background-position: ${pxSpark}% ${pySpark}%; opacity: ${opc / 100};}   /* sparkles */ 
            `: ''
        }
      </style>
    </>



  )
}

export default Card