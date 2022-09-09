import Comment from './Comment'
import { contentForamt, timesAgo } from "../utils";
import { Link } from 'react-router-dom'
import { LikeOutlined, DislikeOutlined, MessageOutlined, EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import Menu from "./MenuCommentDialog";
import { Modal } from 'antd'
import { getCommentList, commentTweet, deleteTweet } from "../api";
import Loading from "../components/Loading";
import { isReplyComment, getNftCode, shortNftCode } from "../utils"
import 'animate.css';


function Item(props) {
    const data = props.data;
    const [showEditor, setShowEditor] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [replyTo, setReplyTo] = useState("")


    function toggleEditor(replyTo) {
        if (!props.store.user.isLogin) return props.dispatch({ type: 'showLoginModal' })
        setReplyTo(replyTo)
        setShowEditor(!showEditor);
        setContent('');
    }

    function like() {
        if (!props.store.user.isLogin) return props.dispatch({ type: 'showLoginModal' })
    }

    function unlike() {
        if (!props.store.user.isLogin) return props.dispatch({ type: 'showLoginModal' })
    }


    const isOwner = useCallback(()=>{
        if(!props.store.user) return false
        if(!props.store.user.nftCode) return false
        if(props.store.user.nftCode !== data.nftCode ) return false

        return true

    },[props.store.user, data.nftCode])

    function editComment() {
        if(!isOwner()) return
        setIsEdit(!isEdit);
        setShowEditor(!showEditor);
        setContent(!isEdit ? data.content : '');
    }

    function update(v) {
        data.content = v;
        props.setList(props.list.slice());
        setIsEdit(false);
        setShowEditor(false);
    }

    function del() {
        Modal.confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            okType: 'danger',
            cancelButtonProps: { shape: 'round', size: 'large' },
            okButtonProps: { shape: 'round', size: 'large' },
            onOk() {
                removeNode(props.list, props.deep);
                props.setList(props.list.slice());
                //deleteTweet({tweetCode: data.tweetCode})
            }
        })
    }
    const [c, setC] = useState(1)

    // function commentListConcat(list, subData){
    //     let count = 0
    //     if(!subData.childCommentList || subData.childCommentList.length === 0) return 
    //     list.concat(subData.childCommentList)
    //     commentListConcat(list, subData.childCommentList, count)
    //     count++
    // }

    // data
    // useEffect(()=> {
    //     if(data && data.childCommentList && data.childCommentList.length > 0) {
    //        let _data = data
    //        while(_data.childCommentList.length > 0) {
    //          a.concat(_data.childCommentList)
    //        }
    //     }
    // } ,[
    //     data.childCommentList
    // ])
    function updateChilCommentList(newItem) {
        if (data && data.childCommentList && newItem) {
            data.childCommentList.unshift(newItem)
        }
    }
    const comment = useCallback((v, next) => {
        _comment(v, next, replyTo)
    }, [
        replyTo
    ])

    function _comment(v, next, _replyTo) {

        console.log(`this is the ${c === 1 ? c + 'st time' : c + 'th times'} call in comment handle`)
        setC(c => c + 1)


        if (!props.tweetCode) return



        if (!data.childCommentList) data.childCommentList = [];
        if (!props.deep) return
        setIsLoading(true)
        if (props.deep.length >= 2) {

            setIsEdit(false);
            setShowEditor(false);
            v = _replyTo ? '@' + _replyTo + ': ' + v : v
            commentTweet({ tweetCode: props.tweetCode, tweetType: 0, content: v, parentCode: props.parentCode }).then(r => {

                if (!r) return
                props.setChildList(

                    {
                        tokenUri: props.store.user.userInfo.tokenUri,
                        username: props.store.user.userInfo.username,
                        createTime: new Date(),
                        like: 0,
                        unlike: 0,
                        nftCode: props.store.user.userInfo.nftCode,
                        content: v,
                        parentCode: props.parentCode,
                        commentCode: r.msg
                    }

                )
                setReplyTo('')
                props.setList(props.list.slice())
            }).finally(
                () => {
                    setIsLoading(false)
                }
            )
        } else {
            setIsEdit(false);
            setShowEditor(false);
            commentTweet({ tweetCode: props.tweetCode, tweetType: 0, content: v, parentCode: data.commentCode }).then(r => {

                if (!r) return
                data.childCommentList.unshift({
                    tokenUri: props.store.user.userInfo.tokenUri,
                    username: props.store.user.userInfo.username,
                    createTime: new Date(),
                    like: 0,
                    unlike: 0,
                    nftCode: props.store.user.userInfo.nftCode,
                    content: v,
                    parentCode: data.commentCode,
                    commentCode: r.msg
                });
                props.setList(props.list.slice())
            }).finally(
                () => {
                    //window.location.reload()
                    setIsLoading(false)
                }
            )
        }

        
    }


    const [renderedContent, setRenderedContent] = useState("")
    const [lookupNftCode, setLookupNftCode] = useState("")
    
    useEffect(() => {
        if (!data.content) return
        if (props.deep.length < 2) return
        console.log("datadata:", data)
        if (!isReplyComment(data.content))
            return

        const nftCode = getNftCode(data.content)

        setLookupNftCode(nftCode)
        setRenderedContent(data.content.substring(68))
    }, [
        data.content
    ])

    const [lookupTimeout, setLookupTimeout] = useState(0)




    const [isCurrentReply, setIsCurrentReply] = useState(false)

    const cancleLookupHandle = useCallback(() => {
        clearTimeout(lookupTimeout)
        setTimeout(() => {
            props.dispatch({ type: "setCurrentReplyNftCode", currentReplyNftCode: '' })
            
        }, (2500));
    }, [lookupTimeout])

    const lookupHandle = useCallback(() => {
        if (!lookupNftCode) return
        setLookupTimeout(setTimeout(() => {

            props.dispatch({ type: "setCurrentReplyNftCode", currentReplyNftCode: lookupNftCode })
        }, 750))

    }, [lookupNftCode])


    useEffect(() => {


        if (!props.store.comment || !props.store.comment.currentReplyNftCode) 
            setIsCurrentReply(false)
        
        if (props.store.comment.currentReplyNftCode === data.nftCode)
            setIsCurrentReply(true)
    }, [
        props.store.comment && props.store.comment.currentReplyNftCode
    ])

    return (
        isLoading ? <Loading visible={true} /> : <div className={`comment-list ${isCurrentReply ? 'light animate__animated  animate__pulse' : ''}`}>
            <> <div className="head">
                <div><img src={data.tokenUri} alt="img" /></div>
                <div><Link to={`/u/${data.nftCode}`}>{data.username}</Link></div>
                <div>{timesAgo(new Date(data.createTime).valueOf())}</div>
            </div>
            </>
            <div className="content">
                {!isEdit && <>
                    {!!renderedContent && props.deep.length >= 2 && <div>
                        <a href={`${window.location.origin}/u/${getNftCode(data.content)}`} target="_self" onMouseEnter={lookupHandle} onMouseLeave={cancleLookupHandle} >@{shortNftCode(getNftCode(data.content))}</a>
                    </div>}
                    <div className="body" dangerouslySetInnerHTML={{ __html: !!renderedContent &&  props.deep.length >= 2 ? renderedContent: data.content }}>
                    </div>
                    <div className="foot">
                        <div onClick={like}><LikeOutlined /><span>{data.like}</span></div>
                        <div onClick={unlike}><DislikeOutlined /><span>{data.unlike}</span></div>
                        <div onClick={() => { toggleEditor(data.nftCode) }}><MessageOutlined /><span>Reply</span></div>
                    </div>
                </>}
                {showEditor && <Comment showTitle={false} value={content} onUpdate={update} onComment={comment} tweetCode={props.tweetCode} commentCode={data.commentCode} parentCode={data.parentCode ? data.parentCode : data.commentCode} />}
                <div className="child">
                    {data.childCommentList && data.childCommentList.length > 0 && data.childCommentList.map((d, i) => <Item deep={[...props.deep, i]} list={props.list} setList={props.setList} setChildList={updateChilCommentList} key={i} data={d} store={props.store} dispatch={props.dispatch} tweetCode={props.tweetCode} commentCode={d.commentCode} parentCode={d.parentCode ? d.parentCode : d.commentCode} />)}
                </div>
            </div>
            {props.store.user.isLogin && <EllipsisOutlined className="e-ellips" onClick={e => Menu.show(e, { data, dispatch: props.dispatch, store: props.store, editComment, del })} />}
        </div>
    )
}

function removeNode(nodes, path) {
    if (path.length === 1) return nodes.splice(path[0], 1);
    let n = path.shift();
    let node = nodes[n];
    while (path.length > 1) {
        n = path.shift();
        node = node.childCommentList[n];
    }
    node.childCommentList.splice(path[0], 1);
}

function CommentList(props) {
    const list = props.list;
    const setList = props.setList;

    return (
        !!list.length ? <div className="container s-comment">
            {list.map((d, i) => <Item deep={[i]} list={list} setList={setList} key={i} data={d} store={props.store} dispatch={props.dispatch} tweetCode={props.tweetCode}/>)}
        </div> : null
    )
}

export default CommentList;