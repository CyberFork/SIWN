import withBar from '../hoc/withBar'
import {Item} from '../components/Communities'
import {PeopleItem} from "../components/PeopleItem";
import {useState, useEffect} from 'react'
import {rem2px} from "../utils";
import MySwiper from '../components/MySwiper'
import PostContainer from '../components/PostContainer'
import Loading from "../components/Loading";

function calcSize() {
    let w = window.innerWidth;
    if(w > 1300) return 4;
    if(w > 1000) return 3;
    if(w > 700) return 2;
    return 1;
}

function calcSizePost() {
    let w = window.innerWidth;
    if(w > 1300) return 2;
    return 1;
}

let targetFn = () => {};

window.addEventListener('resize', () => {
    targetFn();
});


function Discover(props) {
    const [commnuitiesList, setCommnuitiesList] = useState([]);
    const [personList, setPersonList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [view, setView] = useState(calcSize());
    const [postView, setPostView] = useState(calcSizePost())
    const space = rem2px(1);

    useEffect(() => {
        // getDiscoverList().then(r => {
        //     setPostList(r.data.posts);
        //     setPersonList(r.data.users);
        //     setCommnuitiesList(r.data.communities);
        // })
    }, []);

    targetFn = () => {
        setView(calcSize());
        setPostView(calcSizePost());
    };
    return (
        <div className={'container s-discover'}>
            <div className="title">Discover</div>
            <div className="item-title">Communities to join</div>
            <div className="s-communities">
                {!commnuitiesList.length ? <Loading visible={true}/> : <MySwiper list={commnuitiesList} {...props} slidesPerView={view} spaceBetween={space} child={Item}/>}
            </div>
            <div className="item-title">People to follow</div>
            <div className="s-communities">
                {!personList.length ? <Loading visible={true}/> : <MySwiper list={personList} {...props} slidesPerView={view} spaceBetween={space} child={PeopleItem}/>}
            </div>
            <div className="item-title">Recommended posts</div>
            <div className="s-communities">
                {!postList.length ? <Loading visible={true}/> : <MySwiper list={postList} {...props} slidesPerView={postView} spaceBetween={space} child={PostContainer}/>}
            </div>
        </div>
    )
}

export default withBar(Discover)