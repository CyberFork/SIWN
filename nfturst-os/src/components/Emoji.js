const emoji = ["๐","๐","๐","๐","๐","๐","๐คฃ","๐","๐","๐","๐","๐","๐","๐","๐","๐","๐","๐","๐","๐","๐","๐คช","๐","๐ค","๐ค","๐ค","๐ค","๐","๐","๐ถ","๐","๐","๐","๐ฌ","๐คฅ","๐","๐","๐ช","๐คค","๐ด","๐ท","๐ค","๐ค","๐คข","๐คง","๐ต","๐คฏ","๐ค ","๐ฅณ","๐","๐ค","๐ง","๐","๐","๐","โน","๐ฎ","๐ฏ","๐ฒ","๐ณ","๐ฅบ","๐ฆ","๐ง","๐จ","๐ฐ","๐ฅ","๐ข","๐ญ","๐ฑ","๐","๐ฃ","๐","๐","๐ฉ","๐ซ","๐ค","๐ก","๐ ","๐","๐ฟ","๐","๐","โจ","๐","๐","๐งจ","๐","๐ข","๐ฃ","๐","โ","๐","๐","โญ","๐","โ","โ","๐","๐","๐","๐ฅ","๐ผ","โ","๐ฐ"];

function Emoji(props) {

    return (
        props.visible ? <div className="emoji-container">
            {emoji.map((d, i) => <div key={i} onMouseDown={(e) => {
                e.preventDefault();
                props.onChange(d)}}>{d}</div>)}
                <input autoFocus={true} style={{width:0,height:0,border:0,padding:0}} onBlur={props.close} readOnly/>
        </div>: null
    )
}

export default Emoji;