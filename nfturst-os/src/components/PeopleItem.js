import {useState} from 'react'
import SButton from "./SButton";

export function PeopleItem(props) {
    const [isChecked, setChecked] = useState(false);

    return (
        <div className="item">
            <div className="banner">
                <img alt="banner" src={props.data.banner}/>
                <img alt="head" src={props.data.head} className="head person"/>
            </div>
            <div className="flex">
                <div className="title">{props.data.name}</div>
                <div className="desc">{props.data.desc}</div>
                <div className="btn">
                    <SButton isChecked={isChecked} {...props} onClick={() => setChecked(!isChecked)} unchecked={'Follow'} checked={'Unfollow'}></SButton>
                </div>
            </div>
        </div>
    )
}