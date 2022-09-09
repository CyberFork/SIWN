import {useEffect} from 'react'
import {getUnread} from "../api";

export default function withCheckLogin(Cmp) {
    return function Wrapper(props) {
        useEffect(() => {
            if(!props.store.user.isLogin) props.route.navigate('/');
        }, []);
        return (
            props.store.user.isLogin ? <Cmp {...props}/> : null
        )
    }
}