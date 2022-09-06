import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable, observable } from 'mobx'
import { HttpRequest } from '../utils/HttpRequest'
import {login} from "../hooks/useQuery";
export interface ILoginRequestData {
    userAddress: string
    signature: string
    timestamp: number
    target: string
}

export type LoginRequestData = ILoginRequestData | null

class LoginStore {
    reqData: LoginRequestData =null
    isSuccess = false
    target = ''
    signText=""
    constructor() {
        // responsive attribute
        makeAutoObservable(this, { isSuccess: observable, target: observable, signText: observable, reqData: observable })
    }

    setReqData(reqData : LoginRequestData){
        this.reqData = reqData
    }

    setIsSuccess(isSuccess: boolean) {
        console.log("isSuccess: boolean", isSuccess)
        this.isSuccess = isSuccess
    }

    getisSuccess() {
        return this.isSuccess
    }



    getList = async (data: any) => {
        //return (await login(data.userAddress, data.signature, data.message))
       

       
        
    }
    nftLogin = async (nftCode: string) => {
        const token = await HttpRequest.getInstance().request({
            url: '/loginNFT',
            method: 'POST',
            data: { nftCode }
        }).then(async res => {
            console.log("res:", res)
            await this.loginRedirect(res.data.t)
        }).catch(err => {
            console.log("err: ", err)
            return err
        })
    }



    login = async (requestData: LoginRequestData): Promise<boolean> => {
        return await HttpRequest.getInstance().request({
            url: '/login',
            method: 'POST',
            data: requestData
        }).then(res => {
            console.log("res:", res)
            if(!res || !res.data || !res.data.t) return false
            return true
        }).catch(err => {
            console.log("err: ", err)
            return false
        })
    }

    loginRedirect = async (code: any) => {
        const token = await HttpRequest.getInstance().request({
            url: sessionStorage.getItem("target")?.toString() || "",
            method: 'POST',
            data: {code}
        }).then(res => {
            window.close() 
        }).catch(err => {
            console.log("err: ", err)
            return err
        })
    }
    getSignText = async () => {
        return await HttpRequest.getInstance().request({
            url: "signText",
            method: 'GET',
            data: {}
        }).then((res:any) => {
            console.log("getSignText res: ", res)
            return res.msg
        }).catch(err => {
            console.log("err: ", err)
            return err
        })
    }

    setSignText = (text: string) => {
        this.signText = text
    }

    loginLog = async(nftCode:string[], userAddress: string, signature: string, timestamp: number, target: string  ) => {
      
        return await HttpRequest.getInstance().request({
            url: "/logNFT",
            method: 'POST',
            data: {nftCode: JSON.stringify(nftCode), userAddress, signature, timestamp, target}
        }).then((res:any) => {
            console.log("logNFT res: ", res)
            return res.msg
        }).catch(err => {
            console.log("err: ", err)
            return err
        })
    }


}

const loginStore = new LoginStore()
export default loginStore