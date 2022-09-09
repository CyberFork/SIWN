import withBar from '../hoc/withBar'
import withCheckLogin from '../hoc/withCheckLogin'
import {Button} from "antd";
import {RedoOutlined} from '@ant-design/icons'
import { Radio, Space, Tag } from 'antd';
import {useState} from 'react'
import {sliceAddress} from "../utils";


function Settings(props) {
    const [value, setValue] = useState(props.store.user.userInfo.address);
    const addressList = props.store.user.userInfo.addressList;

    const onChange = (e) => {
        setValue(e.target.value);
    };
    function linkWallet() {
        props.dispatch({type: 'showWalletModal'})
    }
    function unLink(address) {
        props.dispatch({type: 'unlink', address});
        setValue(props.store.user.userInfo.address)
    }
    function saveChange() {
        props.dispatch({type: 'changeName', address: value});
    }

    return (
        <div className="container settings-page">
            <div className="item">
                <div className="title">Display Name</div>
                <div className="desc">You can use a ENS domain or set a custom name.</div>
                <Button icon={<RedoOutlined />} shape="round">Refresh NFTs</Button>
                <div className="address">
                    <Radio.Group onChange={onChange} value={value}>
                        <Space direction="vertical">
                            {/*{
                                addressList.map((d, i) => <Radio key={d} value={d}>{sliceAddress(d, 6, 4)}</Radio>)
                            }*/}
                            <Radio value={props.store.user.userInfo.address}>{props.store.user.userInfo.address}</Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <Button type="primary" shape="round" onClick={saveChange}>Save changes</Button>
            </div>
            {/*<div className="item">
                <div className="title">Linked wallets</div>
                <div className="desc">Link wallets to showcase more of your NFTs or enable sign in from other wallet addresses (you can sign in using any wallet linked to your account).</div>
                <div className="link">
                    {
                        addressList.map((d, i) => <div key={d}>
                            <Tag color="green">Linked</Tag>
                            <div>{d} {addressList.length > 1 && <span className="unlink" onClick={() => unLink(d)}>Unlink</span>}</div>
                        </div>)
                    }
                </div>
                <Button shape="round" onClick={linkWallet}>Link Another Wallet</Button>
            </div>*/}
        </div>
    )
}


export default withCheckLogin(withBar(Settings))