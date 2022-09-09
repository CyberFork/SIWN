import {Modal} from 'antd'
import imgMetaMask from '../assets/metamask-logo.png'
import imgWalletConnect from '../assets/walletconnect-logo.png'
import imgCoinbase from '../assets/coinbase-wallet.png'
import Web3 from "web3"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"
import {useState, useEffect} from 'react'
import {LoadingOutlined} from '@ant-design/icons'

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "INFURA_ID" // required
        }
    }
};

const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: false,
    providerOptions
});

async function sign(web3) {
        return web3.eth.personal.sign(web3.utils.fromUtf8(`This one-time signature simply proves you're the owner of the following wallet address:
  
  ${web3.currentProvider.selectedAddress}
  
  Signature transactions do not affect your assets in any way.
  
  Nonce:
  828354`), web3.currentProvider.selectedAddress, '33333');
}

function checkMetaMask() {
    return !web3Modal.providerController.injectedProvider ? false : web3Modal.providerController.injectedProvider.name === 'MetaMask';
}

export function getAddress() {
    if(checkMetaMask()) {
        let web3 = new Web3(window.web3.currentProvider || window.ethereum);
        return web3.currentProvider.selectedAddress || '';
    }
    return '';
}

function Wallet(props) {
    const [state, setState] = useState(0);
    const [error, setError] = useState('');
    const close = () => {
        setState(0);
        setError('');
        props.dispatch({type: 'hideWalletModal'});
    };
    const hasMetaMask = checkMetaMask();
    const connect = async (isMetaMask) => {
        try {
            setState(1);
            web3Modal.clearCachedProvider();
            const provider = isMetaMask ? await web3Modal.connectTo('injected') : await web3Modal.connectTo('walletconnect');
            const web3 = new Web3(provider);
            await sign(web3);
            props.dispatch({type: 'login', address: web3.currentProvider.selectedAddress});
            close();
        } catch (e) {
            setState(2);
            setError(e.message);
        }
    };
    useEffect(() => {
        if(!props.store.modal.isWalletVisible && state !== 0) {
            setState(0);
        }
    }, [props.store.modal.isWalletVisible, state]);
    return (
        <Modal visible={props.store.modal.isWalletVisible} onCancel={close} footer={null} className="s-wallet" zIndex={10003}>
            {state === 0 &&<div>
                <div className="title">Pick a Wallet</div>
                <div className="desc">This wallet becomes your primary connected address. If you own an ENS domain, we'll make that your username. You can change this later though!</div>
                {hasMetaMask && <div className="btn" onClick={() => connect(1)}>
                    <div>Login with MetaMask</div>
                    <div><img alt='wallet' src={imgMetaMask}/></div>
                </div>}
                <div className="btn" onClick={() => connect(0)}>
                    <div>Login with WalletConnect</div>
                    <div><img alt='wallet' src={imgWalletConnect}/></div>
                </div>
                {/*<div className="btn">
                    <div>Login with Coinbase Wallet</div>
                    <div><img alt='wallet' src={imgCoinbase}/></div>
                </div>*/}
            </div>}
            {state === 1 && <div className="loading"><LoadingOutlined /></div>}
            {state === 2 && <div className="error">{error}</div> }
        </Modal>
    )
}

export default Wallet