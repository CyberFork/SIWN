import {Modal, Tabs, Button} from 'antd'
import {CloseCircleOutlined, CopyOutlined, CheckOutlined} from '@ant-design/icons'
import {copy} from "../utils";
import {useEffect, useState} from "react";
import CDialog from "./CDialog";
import SButton from "./SButton";
import {getEnsName} from "../utils/web3Utils"
const {TabPane} = Tabs;


function Copy(props) {
    const [state, setState] = useState(true);
    function onCopy() {
        copy(props.txt).then(() => {
           setState(false);
           setTimeout(() => {setState(true)}, 500);
        });
    }
    return (
        state ? <CopyOutlined onClick={onCopy}/> : <CheckOutlined/>
    )
}

function NFTDetail(props) {
    const [ensName, setEnsName] = useState("")
    const [active, setActive] = useState('1');
    const [isChecked, setChecked] = useState(false);
    const onChange = (key) => {
        setActive(key);
    };

    const postList = new Array(20).fill({
        head: props.store.user.userInfo.tokenUri,
        name: props.store.user.userInfo.name,
    });


    useEffect(()=>{
        if(!props.store.user.isLogin) return 

            getEnsName(props.store.user.userInfo.address).then((data)=>{
            // getEnsName("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045").then((data)=>{
                if(!data) {

                    setEnsName(props.store && props.store.user && props.store.user.userInfo ? props.store.user.userInfo.address : "")
                    return
                }
                console.log("ensName: ", data)
                setEnsName(data.name)
            })
        
    },[
        props.store.user.isLogin, props.store.user.userInfo.address
    ])
    return (
        <Modal closable={false} footer={null} visible={props.visible} onCancel={props.close} width="100%" centered className="nft-detail-container">
            <div className="nft-detail">
                <CloseCircleOutlined onClick={props.close} className="close"/>
                <div className="flex">
                    <div><img src={props.store.user.userInfo.tokenUri} alt="nft" className="nft"/></div>
                    <div>
                        <div className="title">
                            <img src="https://gm-labs-prod.s3.amazonaws.com/profile-pictures/879f321c-03c8-4292-842c-559e758c0932"/>
                            <span>{props.store.user.userInfo.symbol}:{props.store.user.userInfo.name}</span>
                        </div>
                        <div className="desc">{ensName}</div>
                        <Tabs defaultActiveKey="1" onChange={onChange} className="noti-tab">
                            <TabPane tab="Overview" key="1">
                                <div className="item-title">Creator</div>
                                <div className="flex1">
                                    <div>
                                        <span className="svg-header"><svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" height="44" width="44"><rect x="0" y="0" rx="0" ry="0" height="44" width="44" transform="translate(-0.6735480093442571 -5.178687315164792) rotate(437.1 22 22)" fill="#fc7300"></rect><rect x="0" y="0" rx="0" ry="0" height="44" width="44" transform="translate(-24.25132952185923 -7.094314042129674) rotate(325.3 22 22)" fill="#f73c01"></rect><rect x="0" y="0" rx="0" ry="0" height="44" width="44" transform="translate(4.974014752213297 -41.02286327520014) rotate(411.3 22 22)" fill="#f19b02"></rect><rect x="0" y="0" rx="0" ry="0" height="44" width="44" transform="translate(-8.624785983866735 -44.408084190626) rotate(434.7 22 22)" fill="#f3c000"></rect></svg>
                                        </span>
                                        <span>0x5f7d..ea85</span>
                                    </div>
                                </div>
                                <div className="item-title">Owner</div>
                                <div className="flex1">
                                    <div>
                                        <img className="item-head" src="https://gm-labs-prod.s3.amazonaws.com/profile-pictures/879f321c-03c8-4292-842c-559e758c0932" alt="img"/>
                                        <span>{ensName}</span>
                                    </div>
                                    <div>
                                        <SButton isChecked={isChecked} checked={'Unfollow'} unchecked={'Follow'} onClick={() => setChecked(!isChecked)} {...props}/>
                                    </div>
                                </div>
                                <div className="item-title">Description</div>
                                <div className="item-desc">This is an unknown ENS name with the hash: 0x995e4626a1e2cd57ad53c8e4619dcb0b11079ff4891d540b1bc92e7b9f5c32bf</div>
                                <div className="item-title">Attributes</div>
                                <div className="attributes">
                                    {/*No attributes*/}
                                    <div>
                                        <div className="a-title">Background</div>
                                        <div>day</div>
                                    </div>
                                    <div>
                                        <div className="a-title">Pet</div>
                                        <div>Dog</div>
                                    </div>
                                    <div>
                                        <div className="a-title">Dots</div>
                                        <div>12</div>
                                    </div>
                                    <div>
                                        <div className="a-title">Dx</div>
                                        <div>12</div>
                                    </div>
                                </div>
                                <div className="item-title">Collection</div>
                                <div>Ethereum Name Service (ENS) domains are secure domain names for the decentralized world. ENS domains provide a way for users to map human readable names to blockchain and non-blockchain resources, like Ethereum addresses, IPFS hashes, or website URLs. ENS domains can be bought and sold on secondary markets.</div>
                                <div className="item-title">View on</div>
                                <div className="view">
                                    <div><img alt="ico" src="https://etherscan.io/images/favicon3.ico"/><span>Etherscan</span></div>
                                    <div><img alt="ico" src="https://opensea.io/static/images/logos/opensea.svg"/><span>OpenSea</span></div>
                                </div>
                                <div className="item-title">NFT Details</div>
                                <div className="detail">
                                    <div>Blockchain</div>
                                    <div>Ethereum</div>
                                </div>
                                <div className="detail">
                                    <div>Token ID</div>
                                    <div>56546546541123154132132131223</div>
                                    <div><Copy txt="xxxxx"/></div>
                                </div>
                                <div className="detail">
                                    <div>Contract address</div>
                                    <div>0x57f1...ea85</div>
                                    <div><Copy txt="xxxxx"/></div>
                                </div>
                                <div className="detail">
                                    <div>Token standard</div>
                                    <div>ERC721</div>
                                </div>
                            </TabPane>
                            <TabPane tab="Collectors" key="2">
                                {postList.map((data, i) => <Collector key={i} data={data} store={props.store} dispatch={props.dispatch}/>)}
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

function Collector(props) {
    const [isChecked, setChecked] = useState(false);
    const data = props.data;

    return (
        <div className="collector">
            <div>
                <CDialog {...props}>
                    <img src={data.head} alt="img"/>
                </CDialog>
                <span>{data.name}</span>
            </div>
            <div><SButton isChecked={isChecked} checked={'Unfollow'} unchecked={'Follow'} onClick={() => setChecked(!isChecked)} {...props}/></div>
        </div>
    )
}

export default NFTDetail;