import withBar from '../hoc/withBar'
import { FireOutlined, ArrowUpOutlined, MessageOutlined, ReconciliationOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { useState, useEffect, useCallback } from 'react'
import CreatePost from '../components/CreatePost'
import Vlist from '../components/Vlist'
import PostContainer from '../components/PostContainer'
import { getPostList, getTweet } from "../api";
import { NoResults } from "../components/NoResults";

const { Option } = Select;

function Trending(props) {
    const changeSort = props.changeSort;
    const changeSortByTime = props.changeSortByTime;
    return (
        <div className={'container home-trending'}>
            <div className={'home-trending-item'}>
                <div className={props.sortBy === 0 ? 'selected' : null} onClick={() => changeSort(0)}><FireOutlined />Trending</div>
                <div className={props.sortBy === 1 ? 'selected' : null} onClick={() => changeSort(1)}><ReconciliationOutlined />New</div>
                <div className={props.sortBy === 2 ? 'selected' : null} onClick={() => changeSort(2)}><ArrowUpOutlined />Top</div>
                <div className={props.sortBy === 3 ? 'selected' : null} onClick={() => changeSort(3)}><MessageOutlined />Discussed</div>
            </div>
            <div className={'home-trending-item-select'}>
                <Select dropdownStyle={{ 'minWidth': '10rem' }} placement={'bottomLeft'} value={props.sortBy} onChange={(v) => changeSort(v)}>
                    <Option value={0}>Trending</Option>
                    <Option value={1}>New</Option>
                    <Option value={2}>Top</Option>
                    <Option value={3}>Discussed</Option>
                </Select>
            </div>
            {props.sortBy !== 1 && (<div>
                <Select dropdownStyle={{ 'minWidth': '10rem' }} placement={'bottomRight'} value={props.sortByTime} onChange={v => changeSortByTime(v)}>
                    <Option value={0}>This Week</Option>
                    <Option value={1}>This Month</Option>
                    <Option value={2}>This Year</Option>
                    <Option value={3}>All Time</Option>
                </Select>
            </div>)}
        </div>
    )
}

function Home(props) {
    const [hadPage, setHadPage] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [postList, setPostList] = useState([]);
    const [sortBy, setSortBy] = useState(0);
    const [sortByTime, setSortByTime] = useState(0);
    const [pageNum, setPageNum] = useState(1)

    useEffect(() => {
        return
        setPageNum(1)
        loadMoreRows()
        // setHadPage(true);
        // setPostList([]);
        // setSortByTime(0);
    }, [sortBy]);

    useEffect(() => {
        return
        setPageNum(1)
        loadMoreRows()
    }, [sortByTime]);


    useEffect(() => {
        console.log("props.store.user.userInfo.addTweet", props.store.user.userInfo.addTweet)
        if (!props.store.user.userInfo.addTweet) return
        setPageLoading(true);
        setTimeout(() => {
            getTweet({ pageNum: 1, pageSize: 20 }).then(r => {
                if (!r.data || !r.data.tweet) return
                if (r.data.tweet.length < 20) setHadPage(false);
                console.log("postList r.data.tweet:", r.data.tweet)
                // postList.push(...r.data.tweet);
                setPostList(postList => [...r.data.tweet, ...postList])
            }).finally(() => {
                // setPostList(postList.slice());
                setPageLoading(false);
                props.dispatch({ type: 'resetAddTweet' }) 
            });

        }, 500)

    }, [
        props.store.user.userInfo.addTweet
    ])

    // function loadMoreRows({ startIndex, stopIndex }) {
    function loadMoreRows() {
        setPageLoading(true);
        getTweet({ pageNum: pageNum, pageSize: 20 }).then(r => {
            if (!r.data || !r.data.tweet) return
            if (r.data.tweet.length < 20) setHadPage(false);
            console.log("postList r.data.tweet:", r.data.tweet)
            // postList.push(...r.data.tweet);
            setPostList(postList => [...postList, ...r.data.tweet])
            setPageNum(i => i + 1)
        }).finally(() => {
            // setPostList(postList.slice());
            setPageLoading(false);
        });
        // getPostList({pageNo: startIndex, pageSize: 20, sortBy, sortByTime}).then(r => {
        //     if(r.data.length < 20) setHadPage(false);
        //     postList.push(...r.data);
        // }).finally(() => {
        //     setPostList(postList.slice());
        //     setPageLoading(false);
        // });
    }

    return (
        <div className={'home-content'}>
            <CreatePost {...props} />
            <Trending changeSort={setSortBy} sortBy={sortBy} sortByTime={sortByTime} changeSortByTime={setSortByTime} />
            <Vlist key={sortBy + '_' + sortByTime} setList={setPostList} render={PostContainer} loadMoreRows={loadMoreRows} list={postList} {...props} hadPage={hadPage} pageSize={20} pageLoading={pageLoading} />
            {(!postList.length && !hadPage) && <NoResults />}
        </div>
    )
}

export default withBar(Home);