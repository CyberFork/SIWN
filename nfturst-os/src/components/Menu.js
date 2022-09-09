import {Link} from 'react-router-dom'
import {LogoutOutlined, GlobalOutlined, BulbOutlined, QuestionCircleOutlined, InfoCircleOutlined, UserOutlined, BookOutlined, TeamOutlined, BellOutlined} from '@ant-design/icons'
import {logout} from "../store";

function ownProfile(props) {
    return (props.route.location.pathname).indexOf('/u/') > -1 && decodeURIComponent(props.route.params.name) === props.store.user.userInfo.address
}

export default function Menu(props) {
    function hideDrawer() {
        if(props.hideDrawer) {
            props.hideDrawer();
        }
    }
    return (
        <div className="nav-menu">
            <Link onClick={hideDrawer} to="/" className={props.route.location.pathname === '/' ? 'selected' : ''}><GlobalOutlined />All</Link>
            {/* <Link onClick={hideDrawer} to="/discover" className={props.route.location.pathname === '/discover' ? 'selected' : ''}><BulbOutlined />Discover</Link> */}
            {
                props.store.user.isLogin && <>
                    <Link onClick={hideDrawer} to="/communities" className={props.route.location.pathname === '/communities' ? 'selected' : ''}><TeamOutlined />Communities</Link>
                    {/* <Link onClick={hideDrawer} to="/notifications" className={props.route.location.pathname === '/notifications' ? 'selected' : ''}><BellOutlined />Notifications</Link>
                    <Link onClick={hideDrawer} to="/bookmarks" className={props.route.location.pathname === '/bookmarks' ? 'selected' : ''}><BookOutlined />Bookmarks</Link> */}
                    <Link onClick={hideDrawer} to={'/u/' + encodeURIComponent(props.store.user.userInfo.nftCode)} className={ownProfile(props) ? 'selected' : ''}><UserOutlined />Profile</Link>
                </>
            }
            <Link onClick={hideDrawer} to="/about" className={props.route.location.pathname === '/about' ? 'selected' : ''}><InfoCircleOutlined />About</Link>
            <Link onClick={hideDrawer} to="/faq" className={props.route.location.pathname === '/faq' ? 'selected' : ''}><QuestionCircleOutlined />FAQ</Link>
            {
                props.store.user.isLogin && <a onClick={() => props.dispatch(logout)}><LogoutOutlined />Log out</a>
            }
        </div>
    )
}