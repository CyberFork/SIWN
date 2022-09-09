import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    WindowScroller,
    AutoSizer,
    InfiniteLoader
} from 'react-virtualized';
import {useRef, useState, useEffect} from 'react'
import {Skeleton} from "antd";


function remToPx(v) {
    return parseInt(window.getComputedStyle(document.documentElement).fontSize) * v;
}


function MasonryList(props) {
    const masonryRef = useRef();
    const list = props.list;
    const [dw, setDw] = useState(1);
    const [column, setColumn] = useState(3);
    const [hh, setHh] = useState(200);
    const cache = new CellMeasurerCache({
        defaultHeight: hh,
        defaultWidth: dw,
        fixedWidth: true,
    });

    const cellPositioner = createMasonryCellPositioner({
        cellMeasurerCache: cache,
        columnCount: column,
        columnWidth: dw,
        spacer: remToPx(1),
    });

    function CellRenderer({index, parent, style, render, store, dispatch, list, reset}) {
        const data = list[index];
        const Render = render;
        return (
            <CellMeasurer cache={cache} index={index} parent={parent}>
                <div style={style} data-index={index}>
                    <div>
                        {data ? <Render store={store} dispatch={dispatch} data={data} reset={reset}/>: <Skeleton
                            avatar
                            paragraph={{
                                rows: 2,
                            }}/>}
                    </div>
                </div>
            </CellMeasurer>
        );
    }

    function resize({width}) {
        let cc = 4;
        if(width > 934) cc = 4;
        else if(width > 600) cc = 3;
        else if(width > 500) cc = 2;
        else cc = 1;
        let space = remToPx(1);
        let w = (width - (cc - 1) * space) / cc;
        setColumn(cc);
        setDw(w);
    }
    function wndResize() {
        let parent = props.parent.current;
        if(parent) {
            resize({width:parent.offsetWidth});
            window.scroll(0, 0);
        }
    }

    function setParentHeight({scrollHeight}) {
        let parent = props.parent.current;
        if(parent) {
            parent.style.height = scrollHeight + 'px';
        }
    }
    useEffect(() => {
        wndResize({});
    });
    const key = Math.random().toString(16).substr(2);
    const rowCount = props.hadPage ? props.list.length + props.pageSize : props.list.length;
    const loadMoreRows = props.pageLoading ? () => {} : props.loadMoreRows;
    function isRowLoaded ({ index }) {
        return !props.hadPage || index < props.list.length;
    }
    return (
        <AutoSizer key={key}>
            {({width}) => (
                <WindowScroller onResize={wndResize}>
                    {({height, scrollTop}) => (
                        <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
                            {({onRowsRendered}) =>
                            <Masonry
                                onCellsRendered={onRowsRendered}
                                autoHeight={true}
                                cellCount={rowCount}
                                cellMeasurerCache={cache}
                                cellPositioner={cellPositioner}
                                cellRenderer={(s) => <CellRenderer reset={props.reset} setHh={setHh} key={s.key} {...s} store={props.store} dispatch={props.dispatch} render={props.render} list={list}/>}
                                height={height}
                                width={width}
                                ref={masonryRef}
                                onScroll={setParentHeight}
                                scrollTop={scrollTop}
                            />
                            }
                        </InfiniteLoader>
                    )}
                </WindowScroller>
            )}
        </AutoSizer>
    )
}

export default MasonryList;