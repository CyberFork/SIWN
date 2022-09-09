import SButton from "./SButton";
import {Skeleton} from "antd";

export function Item(props) {

    function change() {
        if(typeof props.reset === 'function') {
            props.reset(props.data);
        }
    }

    return (
        <div className="item">
            <div className="banner">
                <img alt="banner" src={props.data.banner}/>
                <img alt="head" src={props.data.head} className="head"/>
            </div>
            <div className="flex">
                <div className="title">{props.data.name}</div>
                <div className="member">{props.data.member} members</div>
                <div className="desc">{props.data.desc}</div>
                <div className="btn">
                    <SButton isChecked={props.data.isJoin} {...props} onClick={change} unchecked={'Join'} checked={'Leave'}></SButton>
                </div>
            </div>
        </div>
    )
}

function Communities(props) {
    const list = props.list || [];
    const cls = ["s-communities", props.className || ''].join(' ');
    return (
        <div className={cls}>
            {
                list.map((d, i) => d ? <Item key={i} data={d} {...props}/> : <Skeleton key={i}
                avatar
                paragraph={{
                rows: 2,
            }}/>)
            }
        </div>
    )
}

export default Communities;