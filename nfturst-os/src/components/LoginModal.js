import {Modal} from 'antd'
import {ifrURL} from "../config";
import {useRef, useEffect, useCallback, useState} from 'react'
import {CloseCircleOutlined} from '@ant-design/icons'

export function LoginModal(props) {
    // const ifrContainer = useRef();
    // const [ifr, setIfr] =  useState()
    // const cb = useCallback(e => {
    //     console.log("in the cb")
    //     // if(typeof e.data === 'object' && e.data.userInfo) {
    //         //     props.dispatch({type: 'login', userInfo: e.data.userInfo});
    //         //     close();
    //         // }
    //         console.log("e.origin:", e.origin)
    //         if(e.origin === 'http://localhost:3000/user') {
    //             console.log('e.data:', e.data)
    //             alert(e.data)
    //             close()
    //         }
            
    //         console.log("end the cb")
        
    // }, []);

    // const createIframe = useCallback((id,url,width,height,onLoadCallback,timeOut,timeOutCallback)=>{

    //     var timeOutVar = setTimeout(function(){
    //         clearTimeout(timeOutVar);
    //         timeOutCallback.apply(this, arguments);
    //         return ;
    //     }, timeOut);

    //     const obj = document.getElementById("iframeContainer")
    //     console.log("obj:", obj)
    //     var iframe = obj.document.createElement("iframe");
    //     iframe.id=id;
    //     iframe.width=width;
    //     iframe.height=height;
    //     iframe.src=url;
    //     if (iframe.attachEvent){
    //         iframe.attachEvent("onload", function(){
    //                 clearTimeout(timeOutVar);
    //             onLoadCallback.apply(this, arguments);
    //         });
    //     } else {
    //         iframe.onload = function(){
    //                 clearTimeout(timeOutVar);
    //             onLoadCallback.apply(this, arguments);
    //         };
    //     }
    //     document.body.appendChild(iframe);
    //     return iframe;
    // },[])

    // useEffect(() => {

    //     if(!props.store.modal.isLoginModalVisible) return
    //   if(!ifrContainer.current) return
    //     console.log("in the createIframe useEffect")
    //     const iframe = createIframe(
    //         "iframe",
    //         ifrURL,
    //         "1000px",
    //         "1000px",
    //         ()=>{console.log("success")},
    //         35000,
    //         ()=>{console.log("open iframe timeout!")}
    //     )

    //     setIfr(iframe)

    //     iframe.contentWindow.postMessage('hello', 'http://localhost:3000/user?target=localhost:3001');
    //     iframe.contentWindow.addEventListener('message', cb);
    //    return () => setTimeout(iframe.contentWindow.removeEventListener('message', cb), 10000)
    // }, [props.store.modal.isLoginModalVisible, ifrContainer.current]);

    // const closeIframe = useCallback(()=>{
    //     if(!ifr) return  
    //     close()
    //     ifr.close()
    // },[
    //     ifr
    // ])
    function close() {
        props.dispatch({type: 'hideLoginModal'})
    }
    return (
        <Modal id="iframeContainer" visible={props.store.modal.isLoginModalVisible} width="100vw" centered footer={null} onCancel={close} closeIcon={<CloseCircleOutlined />}  className="ifr-login-wrapper">

        </Modal>
    )
}