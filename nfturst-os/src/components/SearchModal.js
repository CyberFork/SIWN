import {Modal, Button} from 'antd'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import {useState, useEffect, useRef} from 'react'
import {timesAgo} from "../utils";
import Loading from '../components/Loading'
import {NoResults} from "./NoResults";
import { getTweet } from '../api';



function CommunitiesItem(props) {
    const data = props.data;
    return (
        <div className="search-list-item">
            <div><img src={data.image} alt="Search"/></div>
            <div>
                <div className="search-list-item-title">{data.title}</div>
                <div className="search-list-item-sub-title">{data.subTitle}</div>
            </div>
        </div>
    )
}

function UserItem(props) {
    const data = props.data;
    return (
        <div className="search-list-item round">
            <div><img src={data.image} alt="Search"/></div>
            <div>
                <div className="search-list-item-title">{data.name}</div>
                <div className="search-list-item-sub-title">{data.subName}</div>
            </div>
        </div>
    )
}

function PostItem(props) {
    const data = props.data;
    return (
        <div className="search-list-item round">
            <div><img src={data.image} alt="Search"/></div>
            <div>
                <div className="search-list-item-title">{data.title}</div>
                <div className="search-list-item-sub-title">{data.name} <span>•</span><span>{timesAgo(data.timestamp)}</span></div>
            </div>
        </div>
    )
}

function SearchModal(props) {
    const el = useRef(null);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [noResult, setNoResult] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        if(el && el.current) {
            setTimeout(() => {
                el.current.focus();
            });
        }
    });
    function hide() {
        props.hideSearch();
        setValue('');
        setData({});
        setNoResult(false);
        setIsLoading(false);
    }
    function enter(e) {
        if(e.keyCode === 13) {
            searchHandle();
        }
    }
    function searchHandle() {
        if(value.length === 0) return;
        setData({});
        setIsLoading(true);
        setNoResult(false);
        // getTweet({ pageNum: pageNum, pageSize: 20, nftCode:  nftCode? nftCode: store.user.userInfo.nftCode })
        getTweet({pageNum: 1, pageSize: 20, nftCode: "", keyword: value}).then(r => {
            if(r.data.communities.length === 0 && r.data.users.length === 0 && r.data.posts.length === 0) setNoResult(true);
            else setData(r.data);
        }).finally(() => {
            setIsLoading(false);
        })
    }
    return (
        <Modal visible={props.visible} onCancel={hide} title={null} closable={false} footer={null} className="search-modal-container">
            <div className="search-modal">
                <div onClick={searchHandle}><SearchOutlined /></div>
                <div><input type="text" placeholder="Search..." ref={el} value={value||''} onInput={(e) => setValue(e.target.value)} autoFocus onKeyUp={enter}/></div>
                <div onClick={hide}><CloseCircleOutlined /></div>
            </div>
            {
                (data.communities && data.communities.length) &&
                (
                    <div className="search-modal-list">
                        <div className="title">Communities</div>
                        {
                            data.communities.map((d, i) => {
                                return <CommunitiesItem key={i} data={d}/>
                            })
                        }
                    </div>
                )
            }
            {
                (data.users && data.users.length) &&
                (
                    <div className="search-modal-list">
                        <div className="title">Users</div>
                        {
                            data.users.map((d, i) => {
                                return <UserItem key={i} data={d}/>
                            })
                        }
                    </div>
                )
            }
            {
                (data.posts && data.posts.length) &&
                (
                    <div className="search-modal-list">
                        <div className="title">Posts</div>
                        {
                            data.posts.map((d, i) => {
                                return <PostItem key={i} data={d}/>
                            })
                        }
                    </div>
                )
            }
            <Loading visible={isLoading}/>
            {
                noResult && <NoResults/>
            }
        </Modal>
    )
}

export default SearchModal;