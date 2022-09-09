import {useState} from "react";
import Vlist from "./Vlist";
import PostContainer from './PostContainer'
import {getTweet} from "../api";
import {NoResults} from "./NoResults";


function Posts(props) {
    const [hadPage, setHadPage] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [postList, setPostList] = useState([]);
    const [pageNum, setPageNum] = useState(1)
    const {nftCode, store} = props

    function loadMoreRows ({ startIndex, stopIndex }) {
        setPageLoading(true);
        if(!store.user.isLogin && !nftCode) {
            return 
        }
        
        getTweet({ pageNum: pageNum, pageSize: 20, nftCode:  nftCode? nftCode: store.user.userInfo.nftCode }).then(r => {
            console.log("loadMoreRows r:",r)
            if (!r || !r.data || !r.data.tweet) return
            if (r.data.tweet.length < 20) setHadPage(false);
            console.log("post list:", postList)
            console.log("r.data:", r.data)
            postList.push(...r.data.tweet);
            setPageNum(i => i + 1)
        }).finally(() => {
            setPostList(postList.slice());
            setPageLoading(false);  
        });

        // getPosts({pageSize: 20, pageNo: startIndex}).then(r => {
        //     if(r.data.length < 20) setHadPage(false);
        //     postList.push(...r.data);
        //     setPostList(postList);
        // }).finally(() => {
        //     setPageLoading(false);
        // })
    }

    return (
        <>
            <Vlist setList={setPostList} render={PostContainer} loadMoreRows={loadMoreRows} list={postList} {...props} hadPage={hadPage} pageSize={20} pageLoading={pageLoading}/>
            {(!postList.length && !hadPage) && <NoResults/>}
        </>
    )
}

export default Posts;