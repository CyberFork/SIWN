import withBar from "../hoc/withBar";
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, LinkOutlined } from '@ant-design/icons'
import { Button, Tabs } from 'antd'
import Posts from '../components/Posts'
import { useState, useEffect } from 'react'
import ProfileModal from "../components/ProfileModal";
import NFTs from '../components/NFTs'
import SButton from "../components/SButton";
import DetailComm from "../components/DetailComm";
import { getAllFollowers, getNftUserInfo } from "../api";
import { useNavigate } from "react-router-dom";
import { IS_TODO } from "../config";
const { TabPane } = Tabs;


function isOwn(store, v) {
    return store.user.userInfo.nftCode === v && store.user.isLogin;
}

function Profile(props) {
    let navigate = useNavigate();
    const [active, setActive] = useState('1');
    const [isChecked, setChecked] = useState(false);
    const [data, setData] = useState({});
    const nftCode = props.route.params.name
    const onChange = (key) => {
        setActive(key);
    };
    const isSelfProfile = isOwn(props.store, nftCode);

    function getMyFollowersCountAndToFollowersCount(allFlollowersList){
        if(!allFlollowersList) return
        return {myFollowersCount: allFlollowersList.filter( f => f.relationType === 1).length, toFollowersCount: allFlollowersList.filter( f => f.relationType === 2).length}
    }

    useEffect(()=>{
        async function getDatas(){
            console.log("props.route.params.name:", nftCode)
            if(!nftCode) {
                if(!props.store.user.isLogin){
                    setData(props.store.user.userInfo)
                }
                return
            }
            //getUserInfo
            console.log("get user INfo,", nftCode)
            const userInfo = await getNftUserInfo(nftCode)
            setData(userInfo)
            //getFollowers
            // const allFlollowers = (await getAllFollowers())
            // console.log("allFlollowers:", allFlollowers)
            // if(!allFlollowers || !allFlollowers.data) return
            // const followersData = getMyFollowersCountAndToFollowersCount(allFlollowers.data)
            // console.log('followersData:', followersData)
            // if(!followersData)  return 
            // props.dispatch({type: 'setFollowersCount',myFollowersCount: followersData.myFollowersCount, toFollowersCount: followersData.toFollowersCount})
          
        }

        getDatas()
    },[
        nftCode, props.store.user.isLogin
    ])

    // useEffect(() => {
    //     console.log("props.store.user.isLogin:", props.store.user.isLogin)
    //     if(!props.store.user.isLogin) {
    //         navigate('/')
    //     }

    //     setData(props.store.user.userInfo);

    // }, [props.store.user.userInfo]);

    return (
        <div key={props.route.params.name} className="home-content" style={{ position: 'relative' }}>
            <div className="profile-user">
                <div className="banner" style={{ backgroundImage: `url(${data.banner})` }}>
                    <ArrowLeftOutlined className="back" onClick={() => props.route.navigate(-1)} />
                    {!!data.tokenUri && <img src={data.tokenUri} alt="head" className="head" />}
                </div>
                <div className="content">
                    <div className="btn">
                        {!isSelfProfile && <SButton isChecked={isChecked} checked={'Unfollow'} unchecked={'Follow'} onClick={() => setChecked(!isChecked)} {...props} />}
                        {isSelfProfile && <Button shape="round" onClick={() => props.dispatch({ type: 'showProfileModal' })}>Edit Profile</Button>}
                    </div>
                    <div className="name">{data.username}</div>
                    <div className="desc">{data.bio}</div>
                    <div className="link"><LinkOutlined /><a href={data.link} target="_blank" rel="noopener">{data.link}</a></div>
                    <div className="follow">
                        <span>{props.store.user.isLogin? props.store.user.userInfo.toFollowersCount ? props.store.user.userInfo.toFollowersCount : '0' : ''}</span><span>Following</span>
                        <span>{props.store.user.isLogin? props.store.user.userInfo.myFollowersCount? props.store.user.userInfo.myFollowersCount: '0' :''}</span><span>Followers</span>
                    </div>
                    <Tabs defaultActiveKey={active} onChange={onChange} className="noti-tab">
                        <TabPane tab="Posts" key="1">
                        </TabPane>
                        <TabPane tab="NFTs" key="2">
                        </TabPane>
                        <TabPane tab="Communities" key="3">
                        </TabPane>
                    </Tabs>
                </div>
            </div>

            {active === '1' && <Posts {...props} nftCode={nftCode} />}
            {active === '2' && !IS_TODO && <NFTs {...props} />}
            {active === '3' && <DetailComm {...props} />}
            <ProfileModal {...props} data={data} />
        </div>
    )
}

export default withBar(Profile)