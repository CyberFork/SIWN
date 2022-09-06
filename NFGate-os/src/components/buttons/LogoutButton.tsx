import { Button } from "antd";
import { LoginOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import web3Store from '../../store/Web3Store';

export default function LogoutButton(props: any) {
    const {logoutHandle} = props

  return (
    <>
    <style>
        .hahaha{

        }
    </style>
    <div className="align-center justify-center">
      <Button type="primary" icon={<LoginOutlined/>} onClick={logoutHandle}> logout</Button>
    </div>
    </>
  );
}
