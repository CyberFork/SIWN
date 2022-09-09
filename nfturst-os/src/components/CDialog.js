import { createRoot } from 'react-dom/client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Skeleton } from 'antd'
import SButton from "./SButton";
import { getNftUserInfo, getFollowerCount, followNFT, unfollowNFT } from "../api";
import { debounce } from "debounce";
import { shortNftCode } from '../utils';

const before = {
    transform: 'translateY(10px)',
    opacity: 0,
    transitionDuration: '.3s'
};
const after = {
    transform: 'translateY(0)',
    opacity: 1,
    transitionDuration: '.3s'
};

function CDialog(props) {
    const [foState, setFoState] = useState({
        foOutCount: 0,
        foInCount: 0,
        isFo: false,
    })
    const [data, setData] = useState(null);
    
    const debouncedGetUserInfo = debounce(async () => {
       return await queryFollowers()
      
    }, 2000, true)
    
    const queryFollowers = useCallback(async () => {
        if (!props.nftCode) return null
        return await getNftUserInfo(props.nftCode).then(async r => {
            console.log("getNftUserInfo:", r)
            setData(r);

            return await getFollowerCount(props.nftCode).then(async (res) => {
                console.log("userGetNftFollowers:", res)
                if (!res) return
                setFoState({
                    foOutCount: res.followeeCount,
                    foInCount: res.followedCount,
                    isFo: res.isFollowed == true,
                })
                return { data: r, foState:{
                    foOutCount: res.followeeCount,
                    foInCount: res.followedCount,
                    isFo: res.isFollowed == true,
                }, setFoState}
            })
        });
    }, [props.nftCode])

    const showHandle = useCallback(async ()=>{
        console.log("props.nftCode:", props.nftCode)
        if(!props.nftCode) return 
        const a = await debouncedGetUserInfo()
        return a
    },[props.nftCode]) 



    return (

        <div style={{ display: 'inline-block' }} onMouseEnter={async (e) => {
            const haha = await showHandle()
            console.log("haha:",haha)
            Dialog.show(e, props, haha)

        } } onMouseLeave={() => Dialog.hide()} onClick={() => Dialog.hide()} >
            {props.children}
        </div>
    )
}

function redraw(el) {
    return el.offsetWidth;
}

function Dialog(props) {
    const {showData} = props
    const {foState, data, setFoState} = showData
    const [style, setStyle] = useState(before);
    const [state, setState] = useState(false);
    const [isChecked, setChecked] = useState(false);

    const [followersCount, setFollowersCount] = useState({ myFollowersCount: 0, toFollowersCount: 0 })
    const el = useRef();

    $setStyle = (s, b) => {
        setStyle(s);
        setState(b);
    };
    useEffect(() => {
        redraw(el.current);
        !state && setStyle(after);
    }, [style, state]);

    //    const isFollowed = useCallback((foList)=>{
    //     if(!props.store.user.isLogin) {
    //         props.dispatch({type: 'activeLoginPromptAnimation'}) 
    //         return
    //     }
    //     if(!data || !data.nftCode) return
    //     foList.filter( f => f.followerCode === )
    //    },[
    //     props.store.user.isLogin, data
    //    ])

    // function getMyFollowersCountAndToFollowersCount(allFlollowersList){
    //     let myFollowersCount, toFollowersCount
    //     if(!allFlollowersList || allFlollowersList.length < 1) {
    //         myFollowersCount = 0
    //         toFollowersCount = 0
    //     }else{

    //        myFollowersCount = allFlollowersList.filter( f => f.relationType === 1).length
    //        toFollowersCount = allFlollowersList.filter( f => f.relationType === 2).length

    //     }
    //     return {myFollowersCount, toFollowersCount}
    // }




    // useEffect(() => {
    //     if(!props.nftCode || !props.isShow) return
    //     console.log("props.nftCode", props.nftCode)

    //     getNftUserInfo(props.nftCode).then(r => {
    //         console.log("getNftUserInfo:", r)
    //         setData(r);
    //     });

    //     getAllFollowers(props.nftCode).then((res)=>{
    //         console.log("userGetNftFollowers:", res)
    //         if(!res) return
    //         setFollowersCount(getMyFollowersCountAndToFollowersCount(res.data))
    //     }) 



    //     return () => setData(null);
    // }, [props.nftCode, props.isShow]);

    // const followersCount  = UserGetNftFollowers(props.nftCode)

    // const debouncedFo = debounce(async() => {
    //     followHandle()
    // }, 300)
    const followHandle = useCallback(() => {
        if (!props.store.user.isLogin) {
            props.dispatch({ type: 'activeLoginPromptAnimation' })
            return
        }
        if (!data) return
        console.log("props.store.user.userInfo:", props.store.user.userInfo)
        console.log("data.nftCode:", data.nftCode)
        if (!props.store.user.userInfo.nftCode || !data.nftCode) return
        if (foState.isFo) {
            unfollowNFT({ followerCode: props.store.user.userInfo.nftCode, followeeCode: data.nftCode }).then(r => console.log("unfollowNFT r:", r))
        } else {
            followNFT({ followerCode: props.store.user.userInfo.nftCode, followeeCode: data.nftCode }).then(r => console.log("followNFT r:", r))
        }
    }, [foState.isFo, props.store.user.isLogin, data])

    return (
        <div
            ref={el}
            style={style}
            onMouseEnter={() => {
                Dialog.stopHide()

            }}
            onMouseLeave={() => Dialog.hide()}
        >
            <div className="user-nft-info">
                {data ? <> <div className="head">
                    <img alt="head" src={data.tokenUri} />

                    {props.store.user.isLogin && data.nftCode !== props.store.user.userInfo.nftCode && (<div>
                        <SButton shape="rect" isChecked={foState.isFo} checked={'Unfollow'} unchecked={'Follow'} onClick={() => {
                            // setChecked(!isChecked)
                            setFoState({ ...foState, isFo: !foState.isFo, foInCount: !foState.isFo ? foState.foInCount + 1 : foState.foInCount - 1 })

                            followHandle()

                        }
                        }  {...props} />
                    </div>)}
                </div>
                    <div className="name">{data.username? data.username : shortNftCode(data.nftCode)}</div>
                    <div className="desc">{data.bio}</div>

                    <div className="follow">
                        <span>{foState.foOutCount}</span><span>Following</span>
                        <span>{foState.foInCount}</span><span>Followers</span>
                    </div></> : <Skeleton
                    avatar
                    paragraph={{
                        rows: 2,
                    }} />}
            </div>
        </div>
    )
}

function genKey() {
    return Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2)
}

let target, root, tid, $setStyle = () => { };
Dialog.show = function (e, props, showData) {
    clearTimeout(tid);
    if (!target) {
        target = document.createElement('div');
        target.style.cssText = 'position:fixed;z-index:99999;top:10px;left: 10px';
        root = createRoot(target);
    }
    function changePosition(x, y) {
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }
    const o = e.target.getBoundingClientRect();
    changePosition(o.x, o.y + o.height);
    document.body.appendChild(target);
    root.render(<Dialog key={genKey()} {...props} isShow={true} showData={showData} />);
};

Dialog.hide = function () {
    $setStyle(before, true);
    tid = setTimeout(() => {
        target && target.remove();
    }, 300);
};

Dialog.stopHide = function () {
    $setStyle(after, false);
    clearTimeout(tid);
};

export default CDialog;