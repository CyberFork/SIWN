import { List, WindowScroller, AutoSizer, InfiniteLoader } from 'react-virtualized';
import {useEffect, useRef, useState} from "react";
import {LoadingOutlined} from '@ant-design/icons'
import { Skeleton } from 'antd';


function RowRenderer({
                         index,
                         isScrolling,
                         isVisible,
                         style,
    store, dispatch, render, list, refList, hList, setHlist, setList
                     }) {
    const Cmp = render;
    const el = useRef();
    useEffect(() => {
        if(el.current.scrollHeight !== hList[index]) {
            hList[index] = el.current.scrollHeight;
            setHlist(hList);
            refList.current.recomputeRowHeights(index)
        }
    });
    return (
        <div style={style} data-index={index}>
            <div ref={el}>
                {list[index] ? <Cmp list={list} index={index} setData={setList} store={store} dispatch={dispatch} data={list[index]}/> : <Skeleton
                    avatar
                    paragraph={{
                        rows: 2,
                    }}
                />}
            </div>
        </div>
    );
}

function getOffset(v) {
    return parseInt(window.getComputedStyle(document.documentElement).fontSize) * v;
}

const offset = getOffset(1);

function Vlist(props) {
    const refList = useRef();
    const [hList, setHlist] = useState([]);
    useEffect(() => refList.current.recomputeRowHeights());
    function isRowLoaded ({ index }) {
        return !props.hadPage || index < props.list.length;
    }
    function calcHeight({index}) {
        return hList[index] ? hList[index]  + offset : 80;
    }
    const rowCount = props.hadPage ? props.list.length + props.pageSize : props.list.length;
    const loadMoreRows = props.pageLoading ? () => {} : props.loadMoreRows;

    return (
        <>
        <AutoSizer>
            {({width}) => (
                <WindowScroller>
                {({height, isScrolling, onChildScroll, scrollTop }) => (
                        <InfiniteLoader
                            isRowLoaded={isRowLoaded}
                            loadMoreRows={loadMoreRows}
                            rowCount={rowCount}>
                            {({ onRowsRendered, registerChild }) => (
                                <List
                                    autoHeight
                                    height={height}
                                    onRowsRendered={onRowsRendered}
                                    ref={refList}
                                    isScrolling={isScrolling}
                                    onScroll={onChildScroll}
                                    rowCount={rowCount} 
                                    rowHeight={calcHeight}
                                    rowRenderer={(ps) => <RowRenderer setList={props.setList} key={ps.key} index={ps.index} style={ps.style} store={props.store} dispatch={props.dispatch} render={props.render} hList={hList} list={props.list} refList={refList} setHlist={setHlist}/>}
                                    scrollTop={scrollTop}
                                    width={width}
                                />
                            )}
                        </InfiniteLoader>
                    )}

                </WindowScroller>
                )}
        </AutoSizer>
            {/*{props.pageLoading && <div className="loading"><LoadingOutlined /></div>}*/}

        </>
    )
}

export default Vlist;