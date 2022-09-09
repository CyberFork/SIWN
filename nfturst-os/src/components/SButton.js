import {Button} from 'antd'
import {clickSiwnButton} from '../utils/nftrust2nfgate_new'
import {processAuthData} from "../components/Header"

function SButton(props) {
    const {store} = props
    function handleClick(e) {
        if(store.user && !store.user.isLogin)
        clickSiwnButton(processAuthData)
        if(typeof props.onClick === "function")
            props.onClick(e);
    }
    return (
        !props.isChecked ? <Button size={props.size||'middle'} shape={props.shape||'round'} type='primary' onClick={handleClick}>{props.unchecked}</Button> : <Button size={props.size||'middle'} danger shape={props.shape||'round'} onClick={handleClick}>{props.checked}</Button>
    )
}

export default SButton;