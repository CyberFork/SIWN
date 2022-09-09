import withBar from '../hoc/withBar'
import withCheckLogin from '../hoc/withCheckLogin'
import {useState} from "react";
import Vlist from "../components/Vlist";
import PostContainer from '../components/PostContainer'
import {getBookmarks} from "../api";
import {NoResults} from "../components/NoResults";


function Bookmarks(props) {
    const [hadPage, setHadPage] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [postList, setPostList] = useState([]);

    function loadMoreRows ({ startIndex, stopIndex }) {
        setPageLoading(true);
        getBookmarks({pageNo: startIndex, pageSize: 20}).then(r => {
            if(r.data.length < 20) setHadPage(false);
            postList.push(...r.data);
            setPostList(postList);
        }).finally(() => {
            setPageLoading(false);
        })
    }

    return (
        <>
            <div className="page-title" style={{marginBottom: '1rem'}}>Bookmarks</div>
            <Vlist setList={setPostList} render={PostContainer} loadMoreRows={loadMoreRows} list={postList} {...props} hadPage={hadPage} pageSize={20} pageLoading={pageLoading}/>
            {(!postList.length && !hadPage) && <NoResults/>}
        </>
    )
}

export default withCheckLogin(withBar(Bookmarks))