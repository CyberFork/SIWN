import {Link} from 'react-router-dom'
import {Button} from 'antd'
import {SmileOutlined} from '@ant-design/icons'
import Emoji from './Emoji'
import {useState, useRef} from 'react'

function Comment(props) {
    const [value, setValue] = useState(props.value || '');
    const [visible, setVisible] = useState(false);
    const textarea = useRef();
    const showTitle = props.showTitle === undefined ? true : !!props.showTitle;
    function showEmoji(e) {
        e.preventDefault();
        setVisible(!visible);
    }
    const onUpdate = props.onUpdate || function() {};
    const onComment = props.onComment || function() {};
    function onChange(v) {
        textarea.current.focus();
        document.execCommand('insertText', false, v);
        setVisible(false);
    }

    function submit() {
        const str = value.trim().replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        console.log("submit")
        if(!str.length) return;
        console.log("str:" , str)
        console.log("props.value" , props.value)
        
        if(props.value) {
           onUpdate(str, setValue);
        } else {
            console.log("call onComment")
           onComment(str, setValue);
        }
    }

    return (
        <div className="comment-v">
            <div className="title">{showTitle ? <>Comment as <Link to={"/u/" + props.store.user.userInfo.address}>{props.store.user.userInfo.address}</Link></> : null} <SmileOutlined onMouseDown={showEmoji}/></div>
            <textarea ref={textarea} value={value} placeholder="What are your thoughts?" onChange={e => setValue(e.target.value)}></textarea>
            <div className="right">
                <Button type="primary" shape="round" onClick={submit}>{!props.value ? 'Comment' : 'Update'}</Button>
            </div>
            <Emoji onChange={onChange} visible={visible} close={() => setVisible(false)}/>

        </div>
    )
}

export default Comment;