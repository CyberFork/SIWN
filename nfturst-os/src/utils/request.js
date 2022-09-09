import axios from 'axios'
import { baseURL } from "../config"
import { getStorage, setStorage } from "../utils/localStorage"
import { debounce } from "debounce"

const instance = axios.create({
    baseURL,
    timeout: 60000
})

instance.interceptors.request.use(config => {
    let method = config.method.toUpperCase()
    if (config.data && typeof config.data === 'object') {
        let ob = Object.create(null)
        for (let [key, value] of Object.entries(config.data)) {

            if (value !== '' && value !== undefined && value !== null) ob[key] = value
        }
        config.data = ob

    }
    if (method === 'GET') {
        config.params = config.data
    }
    console.log("interceptors getStorage(token):", getStorage("token"))
    config.headers = {
        ...config.headers,
        Authorization:
            getStorage("token") === null
                ? ""
                : getStorage("token")
    }
    console.log("config:", config)
    return config
})

instance.interceptors.response.use(async response => {
    // console.log("response.status:", response.status)
    // console.log("typeof response.status:", typeof response.status)
    // console.log("response.data.code: ", response.data.code)
    // console.log("typeof response.data.code: ", typeof response.data.code)
    if (Number(response.status) === 200 && Number(response.data.code) === 200) return response.data
    if (Number(response.status) === 200 && Number(response.data.code) === 401 && response.data.msg === "Unauthorized") {

        return (await debouncedFn(response))
    }
    // if(Number(response.status) === 200 && Number(response.data.code) === 0) return response.data;
    return Promise.reject(response.data)
}, err => {
    return Promise.reject(err)
})


const debouncedFn = debounce(async (response) => { return await reFreshHandle(response) }, 2000, true)


async function reFreshHandle (response) {

    const myNft = getStorage('myNft')
    if (!myNft || !myNft.nftCode) return

    return (await instance({
        method: 'post',
        url: '/refresh',
        data: { r: getStorage('rtoken'), nftCode: myNft.nftCode },
    }).then(async (res) => {
        if (!res) return Promise.reject(res.data)

        if (Number(res.code) !== 200) return Promise.reject(res.data)
        if (!res.data || !res.data.t) return Promise.reject(res.data)

        setStorage('token', res.data.t)
        const innerRes = await instance({
            headers: { ...response.config.headers, Authorization: res.data.t },
            method: response.config.method,
            url: response.config.url,
            data: response.config.data
        })

        console.log("innerRes:", innerRes)

        return innerRes
        //return Promise.reject(innerRes.data);
    }))
}

export default instance