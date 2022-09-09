import { Link } from "react-router-dom";
import { copy, timesAgo, shortNftCode } from "../utils";
import { LikeOutlined, DislikeOutlined, MessageOutlined, BookOutlined, ShareAltOutlined, EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import CDialog from './CDialog'
import Menu from './MenuDialog'
import { Image, Modal, notification, Tooltip } from 'antd'
import { formatTime } from "../utils";
import { starTweet,deleteTweet } from "../api"
import { useCallback } from "react";


function PostContainer({ store, dispatch, data, setData, list, unlink, index }) {

    function isLogin() {
        if (!store.user.isLogin) return dispatch({ type: 'isActiveLoginPromptAnimation' })
    }

    function changeLike_old() {
        isLogin()
        data.isStar = !data.isStar;
        if (data.isStar && data.isUnLike) {
            data.isUnLike = false;
            data.unlike -= 1;
        }
        data.isStar ? data.starCount += 1 : data.starCount -= 1;
        setData(list ? list.slice() : Object.assign({}, data))
    }


    function toggleLikeState(data) {
        console.log("toggleLikeState")
        data.isStar = !data.isStar
        data.isStar ? data.starCount += 1 : data.starCount -= 1;
        setData(list ? list.slice() : Object.assign({}, data))
    }

    const changeLikeRequest = useCallback(async () => {
        console.log("tweetCode: data.tweetCode:", data.tweetCode)
        await starTweet({ tweetCode: data.tweetCode, starType: Number(data.isStar) }).then(res => {
            console.log("starTweet")
            if (res && Number(res.code) !== 200) toggleLikeState(data)
        })
    }, [data.isStar])

    function changeLike() {

        if (!store.user.isLogin) {
            dispatch({ type: 'isActiveLoginPromptAnimation' })
            return
        }


        toggleLikeState(data)

        setTimeout(async () => {
            await changeLikeRequest()
        }, 100)
        console.log("list ? list.slice() : Object.assign({}, data):", list ? list.slice() : Object.assign({}, data))
        // setData(Object.assign({}, data))
    }


    function changeUnLike_old() {

        isLogin()

        data.isUnlike = !data.isUnlike;

        if (data.isStar && data.isUnlike) {
            data.isStar = false;
            data.starCount -= 1;
        }
        data.isUnlike ? data.unlike += 1 : data.unlike -= 1;
        setData(list ? list.slice() : Object.assign({}, data))
    }



    function save() {
        isLogin()
        data.isBookmark = !data.isBookmark;
        setData(list ? list.slice() : Object.assign({}, data));
    }

    function more() {
        return (!!data.images && data.images.length > 1) ? 'more' : null
    }

    function m3(i) {
        return (i === 2 && data.images.length === 3) ? 'm3' : null;
    }

    function share() {
        copy(document.location.href).then(() => {
            notification.success({
                message: 'Copied to Clipboard',
                placement: 'bottom',
            })
        })
    }

    function del() {
        Modal.confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            okType: 'danger',
            cancelButtonProps: { shape: 'round', size: 'large' },
            okButtonProps: { shape: 'round', size: 'large' },
            onOk() {
                if (list) {
                    list.splice(index, 1);
                    setData(list.slice());
                    deleteTweet({tweetCode: data.tweetCode})
                } else {
                    document.location.href = '/';
                }


            }
        })
    }
    return (
        <div className={'container'}>
            <div className={'card-item'}>
                <div><CDialog store={store} nftCode={data.nftCode} dispatch={dispatch}><img src={data.tokenUri} alt={'head'} className={'card-head'} /></CDialog></div>
                <div>
                    <div className={'card-item-name'}><CDialog store={store} dispatch={dispatch} nftCode={data.nftCode}><Link to={'/u/' + data.nftCode}>{data.name? data.name: shortNftCode(data.nftCode)}</Link></CDialog></div>
                    <div>{data.desc} <span className="sep">•</span><Tooltip placement="top" title={data.createTime}>{timesAgo(new Date(data.createTime).valueOf(), store.locale.lang)}</Tooltip></div>
                </div>
            </div>
            {store.user.isLogin && <EllipsisOutlined className="e-ellips" onClick={e => Menu.show(e, { dispatch, store, data, del })} />}
            {!unlink ? <Link to={`/c/${data.tweetCode}`}>
                {/* <div className={'card-item-title'}>{data.title}</div> */}
                <div className={'card-item-content'} dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </Link> : <>
                {/* <div className={'card-item-title'}>{data.title}</div> */}
                <div className={'card-item-content'} dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </>}
            {!!data.images && <div className={['card-item-images', more()].join(' ')}>
                {data.images.map((d, i) => <Image src={d} alt="img" key={i} rootClassName={m3(i)} />)}
            </div>}
            <div className={'card-item-cmd'}>
                <div onClick={changeLike} className={(data.isStar && store.user.isLogin) ? 'like-active' : ''}>
                    <LikeOutlined /><span>{data.starCount}</span>
                </div>
                {/* <div onClick={changeUnLike} className={(data.isUnlike && store.user.isLogin) ? 'unlike-active' : ''}>
                    <DislikeOutlined /><span>{data.unlike}</span>
                </div> */}
                <div>
                    <MessageOutlined /><Link to={`/c/${data.tweetCode}`}><span>{data.commentCount ? data.commentCount : 0}</span><span className="home-icon-desc">Comments</span></Link>
                </div>
                {/* <div onClick={save} className={(data.isBookmark && store.user.isLogin) ? 'save-active' : ''}>
                    <BookOutlined /><span className="home-icon-desc">Save</span>
                </div> */}
                <div onClick={share}>
                    <ShareAltOutlined /><span className="home-icon-desc">Share</span>
                </div>
            </div>
        </div>
    )
}

export default PostContainer