import NFTItem from './NFTItem'
import {useState, useEffect} from "react";
import {Skeleton} from "antd";
import {useWindowScroll} from "../hooks/useWindowScroll";
import {NoResults} from "./NoResults";

function NFTs(props) {
    const [list] = useState([]);
    const [tmpList, setTmpList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [hasPage, setHasPage] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const isBottom = useWindowScroll();

    useEffect(() => {
        // if(!hasPage || pageLoading) return;
        // setPageLoading(true);
        // tmpList.push(...new Array(20).fill(null));
        // getNFTs({pageNo, pageSize: 20}).then(r => {
        //     if(r.data.length < 20) setHasPage(false);
        //     list.push(...r.data);
        // }).finally(() => {
        //     setTmpList(list.slice());
        //     setPageLoading(false);
        // });
    }, [pageNo]);

    useEffect(() => {
        if(hasPage && !pageLoading && isBottom) setPageNo(pageNo + 1);
    }, [isBottom]);

    return (
        <>
            <div className="nft-container">
                {tmpList.map((d, i) => {
                    return (
                        d ? <NFTItem key={i} {...props} data={d}/> : <Skeleton key={i}
                            avatar
                            paragraph={{
                                rows: 2,
                            }}/>
                    )
                })}
            </div>
            {(!list.length && !hasPage) && <NoResults/>}

        </>
    )
}


export default NFTs;