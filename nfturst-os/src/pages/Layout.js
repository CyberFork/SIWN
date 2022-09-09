import Header from '../components/Header'
import {Outlet} from 'react-router-dom'
import PageLeft from '../components/PageLeft'
import PageRight from '../components/PageRight'
import {useState, useEffect} from 'react'
import PostModal from "../components/PostModal";
import {LoginModal} from "../components/LoginModal";
//import Wallet from '../components/Wallet'

export default function Layout(props) {
    const [rightBar, setRightBar] = useState(false);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        if(props.store.user.isLogin) {
            setRefresh(false)
        }
    }, [props.store.user.isLogin]);

    useEffect(() => {
        if(!refresh) setRefresh(true)
    }, [refresh]);

    return (
        <>
            <Header {...props}/>
            <div className={'page'}>
                <div className={'page-layout'}>
                    <div className="page-left">
                        <PageLeft {...props}/>
                    </div>
                    <div className="page-center">
                        {refresh ? <Outlet context={[rightBar, setRightBar]}/> : null}
                    </div>
                    {rightBar &&
                    (<div className="page-right">
                            <PageRight {...props}/>
                        </div>
                    )}
                </div>
            </div>
            <PostModal {...props}/>
            <LoginModal {...props}/>
            {/*<Wallet {...props}/>*/}
        </>
    )
}