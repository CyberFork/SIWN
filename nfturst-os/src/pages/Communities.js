import {Tabs} from "antd";
import withCheckLogin from "../hoc/withCheckLogin";
import withBar from '../hoc/withBar'
import {useState} from 'react'
import {SearchOutlined} from '@ant-design/icons'
import MasonryList from '../components/MasonryList'
import {Item} from '../components/Communities'
import {useRef, useEffect} from 'react'

const {TabPane} = Tabs;


function Communities(props) {
    const [hadPage, setHadPage] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [key, setKey] = useState('1');
    const [list, setList] = useState([]);
    const [value, setValue] = useState('')
    const parent = useRef();
    const onChange = (key) => {
        setKey(key);
    };

    useEffect(() => {
        setHadPage(true);
        setValue('');
        setList([]);
    }, [key]);

    function reset(data) {
        data.isJoin = !data.isJoin;
        setList(list.slice());
    }

    function loadMoreRows ({ startIndex, stopIndex }) {
        // setPageLoading(true);
        // getCommunitiesList({pageNo: startIndex, pageSize: 20, isAll: key === '2', keyword: value}).then(r => {
        //     if(r.data.length < 20) setHadPage(false);
        //     list.push(...r.data);
        //     setList(list);
        // }).finally(() => {
        //     setPageLoading(false);
        // });
    }

    function search() {
        if(value.length === 0) return;
        setHadPage(true);
        setList([]);
    }

    function enter(e) {
        if(e.keyCode === 13) {
            search();
        }
    }

    return (
        <div className="container">
            <div className="page-title">Communities</div>
            <Tabs defaultActiveKey={key} onChange={onChange} className="noti-tab">
                <TabPane tab="Joined" key="1">
                </TabPane>
                <TabPane tab="All" key="2">
                </TabPane>
            </Tabs>
            <div>
                <div className="comm-search">
                    <SearchOutlined onClick={search}/>
                    <input type="text" value={value} onChange={e => setValue(e.target.value)} onKeyUp={enter}/>
                </div>
            </div>
            <div className="s-communities p-comm" style={{display:'block'}} ref={parent}>
                <MasonryList list={list} {...props} render={(props) => <Item {...props}/>} reset={reset} parent={parent} loadMoreRows={loadMoreRows} hadPage={hadPage} pageSize={20} pageLoading={pageLoading}/>
            </div>
        </div>
    )
}

export default withCheckLogin(withBar(Communities));