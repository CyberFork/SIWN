import {createRoot} from 'react-dom/client'
import {useState, useEffect, useRef} from 'react'
import {AlertOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'

const before = {
    transform: 'scale(0)',
    transformOrigin: 'top right',
    opacity: 0,
    transitionDuration: '.3s'
};
const after = {
    transform: 'scale(1)',
    transformOrigin: 'top right',
    opacity: 1,
    transitionDuration: '.3s'
};

function redraw(el) {
    return el.offsetHeight;
}

function Dialog(props) {
    const [style, setStyle] = useState(before);
    const [state, setState] = useState(false);
    const el = useRef();
    $setStyle = (s, b) => {
        setStyle(s);
        setState(b);
    };
    useEffect(() => {
        redraw(el.current);
        !state && setStyle(after);
    }, [style, state]);
    function jump() {
        Dialog.hide();
    }
    const isOwn = props.store.user.isLogin && props.store.user.userInfo.nftCode === props.data.nftCode;
    return (
        <div ref={el} style={style}>
            <div className="post-left-menu">
                <div onClick={jump}><AlertOutlined />Report</div>
                {isOwn && <div onClick={() => {Dialog.hide();props.editComment();}}><EditOutlined />Edit</div>}
                {isOwn && <div onClick={() => {Dialog.hide();props.del();}} className="delete"><DeleteOutlined />Delete</div>}
            </div>
        </div>
    )
}

function genKey() {
    return Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2)
}

let target, root, tid, $setStyle = () => {}, currentTarget;

function remToPx(v) {
    return parseInt(window.getComputedStyle(document.documentElement).fontSize) * v;
}

Dialog.show = function(e, props) {
    if(currentTarget === e.currentTarget) return Dialog.hide();
    if(!currentTarget || currentTarget !== e.currentTarget) currentTarget = e.currentTarget;
    e.stopPropagation();
    clearTimeout(tid);
    if(!target) {
        target = document.createElement('div');
        target.style.cssText = 'position:absolute;z-index:99;';
        root = createRoot(target);
    }
    const barWidth = window.innerWidth - document.documentElement.clientWidth || document.body.clientWidth;
    function changePosition(x, y) {
        target.style.right = x + 'px';
        target.style.top = y + 'px';
    }
    const o = e.currentTarget.getBoundingClientRect();
    changePosition(0, o.height);
    e.currentTarget.parentNode.appendChild(target);
    root.render(<Dialog key={genKey()} {...props}/>);
};

Dialog.hide = function() {
    $setStyle(before, true);
    currentTarget = null;
    tid = setTimeout(() => {
        target && target.remove();
    }, 300);
};

window.addEventListener('click', () => {
    Dialog.hide();
});

export default Dialog;