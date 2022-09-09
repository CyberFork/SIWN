import {EditOutlined, PictureOutlined, LinkOutlined, ProfileOutlined} from '@ant-design/icons'

function CreatePost(props) {
    const handle = () => {
        console.log("is login ?", props.store.user.isLogin)
        // if(!props.store.user.isLogin) return props.dispatch({type: 'showLoginModal'})
        if(!props.store.user.isLogin) 
        {
            props.dispatch({type: 'activeLoginPromptAnimation'})
            setTimeout(() => {
                props.dispatch({type: 'cancleLoginPromptAnimation'})
            }, 1200);
            return
        }
        props.dispatch({type: 'showPostModal'})
    };
    return (
        <>
            <div className={'container home-edit'} onClick={handle}>
                <div>
                    <EditOutlined />
                    <span>Create a post</span>
                </div>
                <div><PictureOutlined /></div>
                <div><LinkOutlined /></div>
                <div><ProfileOutlined /></div>
            </div>
        </>
    )
}

export default CreatePost;