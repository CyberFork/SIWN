const emoji = ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","😍","😘","😗","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤔","🤐","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤧","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","😤","😡","😠","😈","👿","🎈","🎁","✨","🎉","🎊","🧨","🛒","📢","📣","🔔","☎","📌","🏝","⭐","🌟","❄","☔","🌛","🌜","🌞","🥂","🌼","☘","💰"];

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