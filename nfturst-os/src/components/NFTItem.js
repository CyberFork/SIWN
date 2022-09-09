import NFTDetail from './NFTDetail'
import {useState} from 'react'

function genKey() {
    return Math.random().toString(16).substr(2) +Math.random().toString(16).substr(2);
}

function NFTItem(props) {
    const [visible, setVisible] = useState(false);
    const [key, setKey] = useState(genKey());
    const close = () => {
        setVisible(false);
        setKey(genKey())
    };
    return (
        <>
            <div className="nft-item" onClick={() => setVisible(true)}>
                <div className="banner">
                    <img src={props.data.img} alt="NFT"/>
                </div>
                <div className="title">
                    <img src={props.data.head} className="head" alt="head"/>
                    <span>{props.data.title}</span>
                </div>
                <div className="desc">{props.data.desc}</div>
            </div>
            <NFTDetail key={key} visible={visible} close={close} {...props}/>
        </>
    )
}

export default NFTItem;