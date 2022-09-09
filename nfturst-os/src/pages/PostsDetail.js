import withBar from "../hoc/withBar";
import {ArrowLeftOutlined} from '@ant-design/icons'
import PostContainer from '../components/PostContainer'
import Loading from "../components/Loading";
import {useState, useEffect} from 'react'
import SButton from '../components/SButton'
import Comment from '../components/Comment'
import CommentList from "../components/CommentList";
import {getCommentList, getPostDetail, commentTweet, getTweet} from "../api";


function PostsDetail(props) {
    const [data, setData] = useState('');
    const [list, setList] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [isLoading, setIsLoading]  = useState(false)

    // function isOwn(store, v) {
    //     return store.user.userInfo.nftCode === v && store.user.isLogin;
    // }

    // const isSelfProfile = isOwn(props.store, props.route.params.hash);
    
    
   /**
    * 3 or more layers => 2 layers
    * @param {[]} list 
    * @returns newList
    */
    function commentListFlattener(list) {
        let newList = list
        for(let i = 0; i < list.length; i++){
            
            if(!list[i].childCommentList || list[i].childCommentList.length === 0) continue
            let subList = []
          
            subList = subList.concat(list[i].childCommentList)
            for(let j =0 ; list[i].childCommentList && j < list[i].childCommentList.length ; j++){
            
                if(list[i].childCommentList[j] && list[i].childCommentList[j].childCommentList && list[i].childCommentList[j].childCommentList.length > 0) { 
                   
                    subList = subList.concat(list[i].childCommentList[j].childCommentList)
                }
               
                delete list[i].childCommentList[j].childCommentList 
            }
           
            newList[i].childCommentList = subList
        }
       
        return newList
    }


    useEffect(() => {
        console.log("props.route.params.hash:", props.route.params.hash)
        if(!props.route.params.hash) return
        
        getCommentList({pageNum, pageSize: 20, tweetCode: props.route.params.hash, mediaType: 0}).then(r => {
            console.log("getCommentList:", r)
            if(r && r.data && r.data.commentList ){
                console.log("r.data.tweet[0]:", r.data.commentList )
                setList(commentListFlattener(r.data.commentList));
            }
        })

    }, [props.route.params.hash]);

    useEffect(() => {
        if(! props.route.params.hash) return 
        getTweet({pageNum:1, pageSize:20, tweetCode: props.route.params.hash}).then(r => {
            console.log("useEffect getTweet:", r)
            if(r && r.data && r.data.tweet && r.data.tweet.length > 0) {
                setData(r.data.tweet[0]);
            }
        })
    }, []);

    function comment(v, next) {
        console.log(" props.route.params.hash:" ,  props.route.params.hash)
        console.log("list:", list)
        
        if(!props.route.params.hash) return
        console.log("v:",v);
        console.log(" props.store.user.userInfo:",  props.store.user.userInfo)
        list.unshift({
            tokenUri: props.store.user.userInfo.tokenUri,
            username: props.store.user.userInfo.username,
            createTime: new Date(),
            like: 0,
            unlike: 0,
            nftCode: props.store.user.userInfo.nftCode,
            content: v,
        });
        next('');
        console.log("new list:", list)
        console.log("props.route.params.hash:" ,  props.route.params.hash)
        setIsLoading(true)
        commentTweet({tweetCode: props.route.params.hash, tweetType: 0, content: v}).then(r => {
            console.log('commentTweet:', r)
            list[0].commentCode = r.msg
            setList(list.slice())
            setIsLoading(false)
        })
    }

    return (
        <div className="page-post-detail">
            <div className="container posts-back" onClick={() => props.route.navigate(-1)}>
                <ArrowLeftOutlined /><span>Post</span>
            </div>
            {!data ? <Loading visible={true}/> : (
            isLoading ? <Loading visible={true}/> :
            <>
                <div className="post-detail">
                    <PostContainer {...props} data={data} unlink={true} setData={setData}/>
                </div>
                <div className="container s-comment">

                 
                    {!props.store.user.isLogin ? <div className="sign">
                        <div>Sign in with Ethereum to leave a comment.</div>
                        <SButton size="large" isChecked={false} unchecked="Sign In With NFT -> NFGate.io" {...props}></SButton>
                    </div> :
                    
                    <Comment {...props} onComment={comment}/>}
                </div>

                <CommentList {...props} list={list} setList={setList} tweetCode={props.route.params.hash}/>
            </>)}
        </div>
    )
}

export default withBar(PostsDetail);