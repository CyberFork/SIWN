import { Button, Select, Drawer } from 'antd'
import { SearchOutlined, BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined, MenuOutlined, CloseCircleOutlined } from '@ant-design/icons'
import logo from '../assets/logo.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import SearchModal from './SearchModal'
import { sliceAddress } from "../utils"
import defHeader from '../assets/def-user.jpeg'
import Menu from "./Menu"
import { getStorage, setStorage } from "../utils/localStorage"
import { Link } from 'react-router-dom'
import { logout } from "../store"
import { getLinks, getNftUserInfo, loginRequest } from "../api"
import { ifrURL, IS_TODO } from "../config"
import { clickSiwnButton } from "../utils/nftrust2nfgate_new"
import { connectServer } from "../api"
import { batchRemoveStorage } from "../utils/localStorage"
import 'animate.css';


const { Option } = Select
let fn = () => { }, closeMenu = () => { }

window.addEventListener('resize', () => {
    fn(window.innerWidth)
})
document.addEventListener('click', () => {
    closeMenu()
})

export async function processAuthData(authData) {
    // ... do something with authData.
    batchRemoveStorage(["token", "myNft"])

    console.log(authData)
    authData = JSON.parse(authData)
    console.log(authData)
    console.log(" authData[signDatas]:", authData["signDatas"])
    const data = {
        signData: {
            userAddress: authData.signDatas.signArgs.walletAddress,
            signedData: authData.signDatas.signedData,
            timestamp: authData.signDatas.signArgs.timestamp,
            signTemplate: authData.signDatas.signTemplate,
            target: window.location.host
        },

        selectedNftDataList: authData.selectedNftDataList[0]
    }
    console.log("data:", data)
    const res = await loginRequest(data)
    console.log("res.data", res.data)
    const userInfo = res.data.userInfo
    console.log("userInfo:", userInfo)
    setStorage("myNft",
        {
            nftCode: userInfo.nftCode,
            tokenId: userInfo.tokenId,
            contract: userInfo.contract,
            chainName: userInfo.chainName,
            chainId: userInfo.chainId,
            bio: userInfo.bio,
            tokenUri: userInfo.tokenUri,
            username: userInfo.username,
            nftName: userInfo.nftName,
            nftSymbol: userInfo.nftSymbol,
            userAddress: userInfo.userAddress,
            unid: `${userInfo.chainName}-${userInfo.chainId}-${userInfo.contract}-${userInfo.tokenId}`,
            banner: userInfo.banner
        })
    setStorage("token", res.data.t)
    setStorage("rtoken", res.data.r)
    document.location.reload()
}

export default function Header(props) {
    const [theme, setTheme] = useState(getStorage('theme') || 'dark')
    const [searchVisible, setSearchVisible] = useState(false)
    const [visible, setVisible] = useState(false)
    const [isOpen, setOpen] = useState(false)
    const refSelect = useRef()

    useEffect(() => {
        // getUnread().then(r => {
        //     props.dispatch({ type: 'updateUnread', unread: r.data })
        // })
    }, [props.route.location])

    function callback(v) {
        document.documentElement.setAttribute('theme', v)
        setStorage('theme', v)
    }
    function changeTheme() {
        refSelect.current && refSelect.current.blur()
        theme === 'light' ? setTheme('dark') : setTheme('light')
    }
    closeMenu = () => setOpen(false)
    function jump(path) {
        setOpen(false)
        props.route.navigate(path)
    }


    function openGate(url, width, height) {

        let strWindowFeatures = `
    width=100vw,
    height=100vh,
    resizable
    menubar=yes,
    location=yes,
    resizable=yes,
    scrollbars=yes,
    status=yes
`
        const nfGate = window.open(url, "nfGate", strWindowFeatures)
        return nfGate
    }

    // useEffect(()=>{
    //     async function _getLinks(){
    //        const userLinks =  await getLinks()
    //        props.dispatch({type:'setUserlinks', userLinks})
    //     }

    //     if(props.store.user.isLogin){
    //         _getLinks()
    //     }
    // },[
    //     props.store.user.isLogin
    // ])

    useEffect(() => {
        if (props.store.user.isLogin) return
        const token = getStorage("token")
        const myNft = getStorage("myNft")
        if (!token || token === 'undefined') return

        if (!myNft || !myNft.nftCode) return

        getNftUserInfo(myNft.nftCode).then(res => {
            console.log("getNftUserInfo res:", res)
            if (!res) return
            res.unid = `${res.chainName}-${res.chainId}-${res.contract}-${res.tokenId}`
            props.dispatch({
                type: 'login',
                userInfo: res
            })

            // connectServer(res.nftCode);
        })

    }, [
        props.store.user.isLogin, getStorage("token")
    ])


    function login() {

        //props.dispatch({ type: 'showLoginModal' })
        clickSiwnButton(processAuthData)

    }

    function onClose() {
        setVisible(false)
    }
    function showMenu() {
        setVisible(true)
    }
    useEffect(() => {
        callback(theme)
    }, [theme])
    fn = w => {
        w > 780 && onClose()
    }
    return (
        <div className="header">
            <div className="header-content">
                <div>
                    <MenuOutlined className="menu-flod" onClick={showMenu} />
                    <Link to="/"><img src={logo} className="header-logo" alt={'logo'} /></Link>
                </div>
                <div>
                    {!IS_TODO &&
                        <div className="header-search" onClick={() => setSearchVisible(true)}>
                            <SearchOutlined />
                            <span>Search</span>
                        </div>
                    }
                </div>
                <div>
                    <div className="header-theme" onClick={changeTheme}>
                        <span className="anticon"> <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="moon"
                            fill="currentColor" role="img" width="1em" height="1em"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                d="M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z"></path>
                        </svg></span>
                    </div>
                    {!props.store.user.isLogin && <Button type="primary" shape="round" className={`${props.store.modal.isActiveLoginPromptAnimation ? 'animate__animated animate__shakeY' : ''}`} onClick={login}>Sign In With NFT -> NFGate.io</Button>}
                    {props.store.user.isLogin && <div className="header-user">

                        {/* <div className="header-theme" onClick={() => jump('/notifications')}><BellOutlined />{props.store.user.unread > 0 && <span className="unread-num">{props.store.user.unread}</span>}</div> */}


                        <div onClick={(e) => { e.stopPropagation(); setOpen(!isOpen) }}>
                            <Select getPopupContainer={triggerNode => triggerNode.parentNode} open={isOpen} ref={refSelect} defaultValue="" placement={'bottomRight'} dropdownStyle={{ 'minWidth': '10rem' }} dropdownRender={() => <div className="user-menu">
                                <div onClick={() => jump('/u/' + encodeURIComponent(props.store.user.userInfo.nftCode))}><UserOutlined /><span>Profile</span></div>
                                <div onClick={() => jump('/settings')}><SettingOutlined /><span>Settings</span></div>
                                <div onClick={() => changeTheme()} className="header-theme-switch"><span className="anticon"> <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="moon"
                                    fill="currentColor" role="img" width="1em" height="1em"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path
                                        d="M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z"></path>
                                </svg></span><span>Switch Theme</span></div>
                                <div onClick={() => props.dispatch(logout)}><LogoutOutlined /><span>Log out</span></div>
                            </div>}>
                                <Option value="" style={{ display: 'none' }}>
                                    <div>
                                        <img alt="Header" className="user-head-img" src={props.store.user.userInfo.tokenUri ? props.store.user.userInfo.tokenUri : defHeader} />
                                        <span className="user-head-address" alt={props.store.user.userInfo.username ? props.store.user.userInfo.username : props.store.user.userInfo.tokenId ? props.store.user.userInfo.tokenId : ""}>
                                            {
                                                props.store.user.userInfo.username ? sliceAddress(props.store.user.userInfo.username, 4, 4) : props.store.user.userInfo.tokenId ? sliceAddress(props.store.user.userInfo.tokenId, 4, 4) : ""
                                            }</span>
                                    </div>
                                </Option>
                            </Select>
                        </div>
                    </div>}
                </div>
            </div>
            {!IS_TODO && <SearchModal visible={searchVisible} hideSearch={() => setSearchVisible(false)} />}
            <Drawer placement="left" visible={visible} onClose={onClose} closable={false} width={'18rem'} zIndex={1052}>
                <div className="drawer-menu">
                    {!props.store.user.isLogin && <Button type="primary" shape="round" size="large" onClick={login} className={`${props.store.modal.isActiveLoginPromptAnimation ? 'animate__animated animate__shakeY' : ''}`} >Sign In With NFT -> NFGate.io</Button>}
                    {props.store.user.isLogin && <div className="user-info-card">
                        <div>
                            <img className="user-info-card-head" src={props.store.user.userInfo.tokenUri ? props.store.user.userInfo.tokenUri : defHeader} alt="Header" />
                            <div className="user-info-card-address" alt={props.store.user.userInfo.username ? props.store.user.userInfo.username : props.store.user.userInfo.tokenId ? props.store.user.userInfo.tokenId : ""}>{
                                props.store.user.userInfo.username ? sliceAddress(props.store.user.userInfo.username, 4, 4) : props.store.user.userInfo.tokenId ? sliceAddress(props.store.user.userInfo.tokenId, 4, 4) : ""
                            }</div>
                        </div>
                        <div>
                            <div>90<span className="user-info-card-follow">Following</span></div>
                            <div>90<span className="user-info-card-follow">Followings</span></div>
                        </div>
                    </div>}
                    <CloseCircleOutlined className="drawer-menu-close" onClick={onClose} />
                </div>
                <Menu {...props} hideDrawer={onClose} />
            </Drawer>
        </div>
    )
}