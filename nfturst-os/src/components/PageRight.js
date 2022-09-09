import {Button, Skeleton} from 'antd'
import {Link} from 'react-router-dom'
import {LikeOutlined} from '@ant-design/icons'
import {useState, useEffect} from 'react'
import SButton from "./SButton";
import NFTDetail from './NFTDetail'
import {NoResults} from "./NoResults";

function Item(props) {
    const [isChecked, setChecked] = useState(false);

    return (

        <div className={'top-item'}>
            <div>{props.index + 1}</div>
            <div><img src={props.data.head} alt={'head'}/></div>
            <div className="top-item-name"><Link to={props.data.href}>{props.data.name}</Link></div>
            <div>
                <SButton isChecked={isChecked} checked={'Leave'} unchecked={'Join'} onClick={() => setChecked(!isChecked)} {...props}/>
            </div>
        </div>
    )
}

function PostsItem(props) {
    return (
        <div className={'posts-item'}>
            <div className={'posts-item-title'}><Link to='/c/xxxx'><span>{props.index + 1}.</span>{props.data.title}</Link></div>
            <div className={'posts-item-name'}><Link to={'/u/xxxx'}><img src={props.data.image} alt={props.data.name} className={'posts-item-image'}/><span>{props.data.name}</span></Link></div>
            <div className={'posts-item-flex'}>
                <div><LikeOutlined />{props.data.likeNum}</div>
                <div><Link to="/xx">{props.data.commentsNum} comments</Link></div>
                <div><Link to="/u/xxxxx">{props.data.subTitle}</Link></div>
            </div>
        </div>
    )
}

function NFTItem(props) {
    const data = props.data;
    const [visible, setVisible] = useState(false);
    const [key, setKey] = useState(genKey());
    const close = () => {
        setVisible(false);
        setKey(genKey())
    };
    const show =() => {
        setVisible(true);
    };
    return (
        <div className="r-nft-item">
            {/* <div onClick={show}><img src={data.image} alt="img"/></div> */}
            <div /*onClick={show}*/><img src={props.store.user.userInfo.tokenUri} alt="img"/></div>
            <div>
                <div className="title" /*onClick={show}*/>Your NFT</div>
                <div className="desc" /*onClick={show}*/>{props.store.user.userInfo.bio}</div>
                {/* <div className="title" onClick={show}>{data.title}</div>
                <div className="desc" onClick={show}>{data.desc}</div> */}
                <div className="owner"><img src={props.store.user.userInfo.tokenUri} alt="img"/>
                {/* <Link to={`/u/${props.store.user.userInfo.nftCode}`}>{props.store.user.userInfo.address}</Link> */}
                </div>
            </div>
            <NFTDetail key={key} visible={visible} close={close} {...props}/>
        </div>
    )
}

function genKey() {
    return Math.random().toString(16).substr(2) +Math.random().toString(16).substr(2);
}

export default function PageRight(props) {
    /*const list = [
        {name: 'c/Aaa', head: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', href: '/404'},
        {name: 'c/Aaa', head: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', href: '/404'},
        {name: 'c/Aaa', head: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', href: '/404'},
        {name: 'c/Aaa', head: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', href: '/404'},
        {name: 'c/Aaa', head: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', href: '/404'},
    ];
    const listPosts = [
        {subTitle: 'ethere.io', commentsNum: 10, likeNum: 50, name: 'c/Aaa', image: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', title: 'I lot to ruminate on here. I am glad someone put a lot of my thoughts into one post in a format that we are so accustomed to seeing - Twitter haha.'},
        {subTitle: 'ethere.io', commentsNum: 10, likeNum: 50, name: 'c/Aaa', image: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', title: 'I lot to ruminate on here. I am glad someone put a lot of my thoughts into one post in a format that we are so accustomed to seeing - Twitter haha.'},
        {subTitle: 'ethere.io', commentsNum: 10, likeNum: 50, name: 'c/Aaa', image: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', title: 'I lot to ruminate on here. I am glad someone put a lot of my thoughts into one post in a format that we are so accustomed to seeing - Twitter haha.'},
        {subTitle: 'ethere.io', commentsNum: 10, likeNum: 50, name: 'c/Aaa', image: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', title: 'I lot to ruminate on here. I am glad someone put a lot of my thoughts into one post in a format that we are so accustomed to seeing - Twitter haha.'},
        {subTitle: 'ethere.io', commentsNum: 10, likeNum: 50, name: 'c/Aaa', image: 'https://gm-labs-prod.s3.amazonaws.com/community-images/12356fcf-d768-46c2-858f-4225be2c0b3e.jpeg', title: 'I lot to ruminate on here. I am glad someone put a lot of my thoughts into one post in a format that we are so accustomed to seeing - Twitter haha.'},
    ];*/
    const [isHover, setHover] = useState(false);
    const [nftList, setNftList] = useState(new Array(10).fill(null));
    const [noResult, setNoResult] = useState(false);
    function handleEnter() {
        setHover(true);
    }
    function handleOut() {
        setHover(false);
    }

    useEffect(() => {
        // getRecommendNFts().then(r => {
        //     if(r.data.length === 0) setNoResult(true);
        //     setNftList(r.data);
        // }).catch(() => {
        //     setNftList([]);
        // });
    }, []);

    return (
        <div className={['top-container', isHover ? 'is-hover' : ''].join(' ')}>
            <div className={'top'}>
                {/*<div className={'container'}>
                    <div className="right-title">Top Communities Today</div>
                    {list.map((d, i) => {
                        return <Item data={d} index={i} key={i} {...props}/>
                    })}
                </div>
                <div className={'container'}>
                    <div className={'right-title'}>Top Posts Today</div>
                    {
                        listPosts.map((d, i) => {
                            return <PostsItem data={d} index={i} key={i}/>
                        })
                    }
                </div>*/}
                <div className="container">
                    {/* <div className="right-title">Recommend NFTs</div> */}
                    <div className="right-title">Recommend NFTs(Coming S∞n)</div>
                    {
                     props.store  && props.store.user.isLogin &&   nftList.map((d, i) => {
                            return d ? <NFTItem data={d} index={i} key={i} store={props.store}/> : <Skeleton key={i}
                                                                                         avatar
                                                                                         paragraph={{
                                                                                             rows: 2,
                                                                                         }}/>
                        })
                    }
                    {
                        noResult && <NoResults/>
                    }
                </div>
            </div>
        </div>
    )
}