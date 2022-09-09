import Comm from './Communities'
import {useState, useEffect} from 'react'
import {getProfileCommunities} from "../api";
import {useWindowScroll} from "../hooks/useWindowScroll";
import {NoResults} from "./NoResults";


function DetailComm(props) {
    const [list] = useState([]);
    const [tmpList, setTmpList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);
    const [hasPage, setHasPage] = useState(true);
    const isBottom = useWindowScroll();

    useEffect(() => {
        // setPageLoading(true);
        // tmpList.push(...new Array(20).fill(null));
        // getProfileCommunities({pageNo, pageSize: 20}).then(r => {
        //     if(r.data.length < 20) setHasPage(false);
        //     list.push(...r.data);
        // }).finally(() => {
        //     setTmpList(list.slice());
        //     setPageLoading(false);
        // })

        return () => {setTmpList([])}
    }, [pageNo]);

    useEffect(() => {
        if(hasPage && !pageLoading && isBottom) setPageNo(pageNo + 1);
    }, [isBottom])

    return (
        <>
            <Comm {...props} list={tmpList}/>
            {(!list.length && !hasPage) && <NoResults/>}
        </>
    )
}

export default DetailComm;