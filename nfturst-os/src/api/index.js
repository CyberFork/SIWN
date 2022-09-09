import request from '../utils/request'
import {post, get, deleteReq} from '../utils/requestArray'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { getStorage } from '../utils/localStorage'


export function getCommentList (data) {
    return post('/getCommentList',
        data, false
    ).then(r=> r.data)
}
export function deleteTweet (data) {
    return deleteReq('/deleteTweet',
        data, true
    )
}
export function reTweet (data) {
    return post('/reTweet',
        data, true
    )
}


export function loginRequest (data) {
    return post(
         '/login',
        data, false
    ).then(r => r.data)
}


export function updateNFTCustomInfo (data) {
    return post(
        '/updateNFTCustomInfo',
        data, true
    ).then(r => r.data)
}

export function updateNFTLinkInfo (data) {
    return post('/updateNFTLinkInfo',
        data , true).then(r => r.data)
}

export function publishTweet (data) {
    return post('/publishTweet',
        data, true
    ).then( r => r.data)
}
export  function getTweet (data) {
    return  post("/getTweet",data, false).then(r => {
        if(!r) return  null
        return r.data
    })
        
}

export function starTweet (data) {
    return post( '/starTweet',
        data, true).then(r => r.data)
}

export function getAllFollowers (nfCode) {
   return  get(`/getFollowers/0${nfCode ? '/' + nfCode : ''}`,
    ).then( r => {
        console.log("getAllFollowers r", r)
        return r.data
    })
}
// export function getFollowerCount(nfCode) {
//     const fos =  request({
//         method: 'get',
//         url: `/getFollowerCount/0${nfCode? '/'+nfCode:''}`,
//     })

//    return fos
// }
export async function getLinks (data) {
    const userLinks = await get('/getLinks')
    if (!userLinks) return false
    return userLinks.data.data
}

export async function getNftUserInfo (data) {
    const userInfo = await get(`/getNftUserInfo/${data}`)
    if (!userInfo) return false
    if (!userInfo.data) return false
    console.log("getNftUserInfo api :", userInfo)
    return userInfo.data.data
}
export async function getFollowerCount (data) {
    const foInfo = await get(`/getFollowerCount/${data}`)
    if (!foInfo) return false
    if (!foInfo.data) return false
    console.log("getFollowerCount api :", foInfo)
    return foInfo.data.data
}

export function commentTweet (data) {
    return post( '/commentTweet',
        data, true)
}

export function followNFT (data) {
    return post('/followNFT',
        data, true)
}

export function unfollowNFT (data) {
    return post('/unfollowNFT',data, true)
}

export function connectServer (nftCode) {

    if (!!window.EventSource) {

        /**
         * @description: create connection to server
         * @return {*}
         */
        const source = new EventSourcePolyfill('https://nfchat.io/nftrust/connect/' + nftCode, {
            headers: {
                'Authorization': getStorage("token")
            }
        })


        /**
         * @description: open event
         * @param {*} open event
         * @param {*} function open callback
         * @return {*}
         */
        source.addEventListener('open', function (e) {
            console.log('connect...')
        }, false)


        /**
         * @description: message event
         * @param {*} message event
         * @param {*} function message callback
         * @return {*}
         */
        source.addEventListener('message', function (e) {
            console.log("message: ", e.data)
        })



        /**
         * @description: error event
         * @param {*} error event
         * @param {*} function error callback
         * @return {*}
         */
        source.addEventListener('error', function (e) {
            if (e.readyState === EventSource.CLOSED) {
                console.log("close connect")
            } else {
                console.log(e.error)
            }
        }, false)

        /**
         * @description: maunal close connection  
         * @return {*}
         */
        window.onbeforeunload = function () {
            closeSse()
        }

    } else {
        console.log("not support sse.")
    }
}

/**
 * @description: close connection 
 * @param {*} source EventSource
 * @param {*} nftCode nftCode
 * @return {*}
 */
function closeSse (source, nftCode) {
    if(!source || !nftCode) return
    source.close()
    const httpRequest = new XMLHttpRequest()
    httpRequest.open('GET', 'https://nfchat.io/nftrust/close/' + nftCode, true)
    httpRequest.send()
    console.log("close")
}

