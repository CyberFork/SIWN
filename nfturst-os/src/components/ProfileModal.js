import { Modal, Button, Select, Upload, notification } from 'antd'
import ImgCrop from 'antd-img-crop'
import { CameraOutlined, RedoOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import defUserHead from '../assets/def-user.jpeg'
import { useState, useEffect } from 'react'
import { checkURL } from "../utils";
import { updateNFTCustomInfo, updateNFTLinkInfo, getNftUserInfo } from "../api"

const { Option } = Select;

function ProfileModal(props) {
    const [userHead, setUserHead] = useState(defUserHead);
    const [banner, setBanner] = useState(defUserHead);
    const [value, setValue] = useState("");
    const [length, setLength] = useState(0);
    const [nameLength, setNameLength] = useState(0);
    const [formData, setFormData] = useState({
        url: '',
        bio: '',
        username: '',
        banner: ''
    });
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();


    const onClose = () => {
        props.dispatch({ type: 'hideProfileModal' });
    };

    useEffect(() => {
        if(!props.store.user.userInfo) return
        console.log("props.store.user.userInfo.username:", props.store.user.userInfo.username)
        setFormData({
            url: props.store.user.userInfo.link || '',
            bio: props.store.user.userInfo.bio || '',
            username: props.store.user.userInfo.username || ''
        });
    }, [props.store.user.userInfo.username]);

    useEffect(()=>{
        if(!imageUrl) return 
        setBanner(imageUrl)
    },[
        imageUrl
    ])

    useEffect(() => {
        setLength(formData.bio.length);
    }, [formData.bio]);

    useEffect(() => {
        setNameLength(formData.username.length);
    }, [formData.username]);


    const save = async () => {
        if (formData.url !== '' && !checkURL(formData.url)) return notification.error({
            message: 'Invalid URL',
            placement: 'bottom',
        })
        console.log('formData:', formData);
        console.log('banner:', banner)
        await updateNFTCustomInfo({ bio: formData.bio, banner: banner, username: formData.username })
        
        //await updateNFTLinkInfo({ nftCode: props.store.user.userInfo.nftCode, platformName: 'twitter', platformUrl: formData.url || 'www.twitter.com' })
        
        console.log('props.store.user.userInfo.nftCode:', props.store.user.userInfo.nftCode)
        const _userInfo = await getNftUserInfo(props.store.user.userInfo.nftCode)
        console.log("getNftUserInfo _userInfo:", _userInfo)
        if(!_userInfo) return
        props.dispatch({type:'setUserInfo', userInfo:_userInfo})
        props.dispatch({type:'hideProfileModal'})
    };

    const change = (v, c) => {
        setFormData(Object.assign({}, formData, v));
    };

    const bannerChange = (file, fileList, event) => {
        console.log(file, fileList, event);
        // setBanner(file)
    };

    // const headChange = (file, fileList, event) => {
    //     console.log(event);
    // };

    useEffect(() => {
        setUserHead(props.store.user.userInfo.tokenUri)
    }, [
        props.store.user.userInfo.tokenUri
    ])
    useEffect(() => {
        setBanner(props.store.user.userInfo.banner)
    }, [
        props.store.user.userInfo.banner
    ])

    const footer = (
        <div className="footer">
            <Button shape="round" onClick={onClose} size="large">Cancel</Button>
            <Button shape="round" type="primary" size="large" onClick={save}>Save</Button>
        </div>
    );
    // 472 x 160
    // useEffect(() => {
    //     if (!formData.banner) return
    //     imgChange(formData.banner)
    // }, [
    //     formData.banner
    // ])

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            notification.warning({
                message: 'You can only upload JPG/PNG file!',
                placement: 'top',
            })
        }

        const isLt2M = file.size / 1024 / 1024 < 1;

        if (!isLt2M) {
            notification.warning({
                message: 'Image must smaller than 2MB!',
                placement: 'top',
            })
        }

        return isJpgOrPng && isLt2M;
    };



    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
                console.log("url:", url)
                console.log("url:", url.length)
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    return (
        <Modal className="profile-edit" onCancel={onClose} visible={props.store.modal.isProfileVisible} title="Edit Profile" footer={footer}>

            <div className="banner">
                <ImgCrop aspect={3.52}>
                    <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}

                    >
                        {imageUrl ||  props.store.user.userInfo.banner ? (
                            <img
                                src={imageUrl? imageUrl : props.store.user.userInfo.banner }
                                alt="avatar"
                                style={{
                                    width: '472px',
                                    height: '160px',
                                    position: 'relative',
                                    top: '.25rem',
                                    left: '.28rem',
                                    borderRadius: '10px'
                                }}
                            />
                        ) : (
                            uploadButton
                        )}

                        {/* <img src={banner ? banner : ""} alt="banner"></img> */}
                        {/* <CameraOutlined className="camera" /> */}
                    </Upload>
                </ImgCrop>
            </div>
            <div className="flex">
                <div className="head">
                    <ImgCrop>
                        {/* <Upload showUploadList={false} onChange={headChange}> */}
                        <img src={userHead} alt="head" />
                        {/* <CameraOutlined className="camera"/> */}
                        {/* </Upload> */}
                    </ImgCrop>
                </div>
                <div>
                    {/*<Button icon={<RedoOutlined />} shape="round">Refresh NFTs</Button>*/}
                </div>
            </div>
            {/* <div className="title">Display name</div>
            <div className="flex">
                <div>
                    <Select className="select" defaultValue={value} onChange={v => setValue(v)} getPopupContainer={o => o.parentNode}>
                        <Option value="">{sliceAddress(props.store.user.userInfo.address, 6, 4)}</Option>
                        <Option value="cdn">Custom display name</Option>
                    </Select>
                </div>
                <div className="cdn">{value==='cdn' && <input type="text" value={formData.custom} onChange={e => change({custom: e.target.value})}/>}</div>
            </div>*/}

            <div className="title">UNID</div>
            <input value={props.store.user.userInfo.unid} disabled={true}></input>
            <div className="title">Nick Name (optional) <span>{nameLength}/25</span></div>
            <input value={formData.username? formData.username: props.store.user.userInfo.username} onChange={e => change({ username: e.target.value.slice(0, 25) })}></input>
            <div className="title">Bio (optional) <span>{length}/300</span></div>
            <textarea value={formData.bio} onChange={e => change({ bio: e.target.value.slice(0, 300) })} maxLength={300}></textarea>
            <div className="title">Website (optional)</div>
            <input type="text" value={formData.url} onChange={(e) => change({ url: e.target.value })} />
        </Modal>
    )
}

export default ProfileModal;