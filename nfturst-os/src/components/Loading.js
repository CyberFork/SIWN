import {LoadingOutlined} from '@ant-design/icons'

function Loading(props) {
    return (
        props.visible ? <div className="s-loading">
            <LoadingOutlined />
        </div> : null
    )
}

export default Loading