import withBar from '../hoc/withBar'
import withCheckLogin from '../hoc/withCheckLogin'
import Loading from '../components/Loading'
import { Tabs } from 'antd';
import {useState, useEffect} from 'react'
import {clearUnread, getNotifications} from "../api";
import {Link} from 'react-router-dom'
import {timesAgo} from "../utils";
import { Popconfirm } from 'antd';
const { TabPane } = Tabs;

function NotiItem(props) {
    const {data, list, updateList, index} = props;
    function del() {
        list.splice(index, 1);
        updateList(list.slice());
    }
    return (
        <div className="noti-item">
            <div>
            <span><Link to={'/u/' + data.name}>{data.name}</Link></span>
            {(data.type === 0 && data.contentType === 0) && <><span>liked</span><span><Link to={'/c/' + data.name}>post</Link></span></>}
            {(data.type === 0 && data.contentType === 1) && <><span>liked</span><span><Link to={'/c/' + data.name}>comment</Link></span></>}
            {(data.type === 1 && data.contentType === 0) && <><span>replied</span><span><Link to={'/c/' + data.name}>post</Link></span></>}
            {(data.type === 1 && data.contentType === 1) && <><span>replied</span><span><Link to={'/c/' + data.name}>comment</Link></span></>}
            <span>{timesAgo(data.timestamp)}</span>
            </div>
            <div>
                <Popconfirm title="Are you sure?" okText="yes" cancelText="no" onConfirm={del}>
                    <a>Clear</a>
                </Popconfirm>
            </div>
        </div>
    )
}

function Notifications(props) {
    const [isLoading, setLoading] = useState(true);
    const [noResult, setNoResult] = useState(false);
    const [list, setList] = useState([]);
    const [type, setType] = useState('');

    const onChange = (key) => {
        setType(key);
        setNoResult(false);
    };

    useEffect(() => {
        setLoading(true);
        setList([]);
        getNotifications({type}).then(r => {
            setList(r.data);
            setNoResult(r.data.length === 0);
        }).finally(() => {
            setLoading(false);
        });
    }, [type]);

    useEffect(() => {
        clearUnread().then(() => {
            props.dispatch({type: 'updateUnread', unread: 0})
        });
    }, []);

    function clearAll() {
        setList([]);
        setNoResult(true);
    }

    return (
        <div className="container">
            <div className="page-title">Notifications</div>
            <Tabs defaultActiveKey={type} onChange={onChange} className="noti-tab">
                <TabPane tab="All" key="">
                </TabPane>
                <TabPane tab="Liked" key={0}>
                </TabPane>
                <TabPane tab="Replies" key={1}>
                </TabPane>
            </Tabs>
            <div>
                <Popconfirm title="Are you sure?" okText="yes" cancelText="no" onConfirm={clearAll}>
                    <a>Clear All</a>
                </Popconfirm>
                <Loading visible={isLoading}/>
            </div>
            {list.map((d, i) => {
                return <NotiItem {...props} data={d} key={i} index={i} updateList={setList} list={list}/>
            })}
            {noResult && <div className="no-res">No Notifications to Display!</div>}
        </div>
    )
}

export default withCheckLogin(withBar(Notifications))