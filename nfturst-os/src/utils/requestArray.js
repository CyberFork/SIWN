import axios from 'axios'
import { baseURL } from "../config"
import { getToken, setToken, getRefreshToken } from './auth'
import {getStorage} from './localStorage'

// refresh access_token api
const refreshToken = () => {
    const myNft = getStorage('myNft')
    if(!myNft  ||  !myNft.nftCode) return null
    return instance.post('/refresh', { r: getRefreshToken(), nftCode: myNft.nftCode}, true)
}

// Create an axios instance
const instance = axios.create({
  baseURL:  baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
})

let isRefreshing = false // Mark if it is refreshing token
let requests = [] // Array to store pending requests

instance.interceptors.response.use(response => {
    if(Number(response.status) === 200 && Number(response.data.code) === 401 && response.data.msg === "Unauthorized")
    {
        
        const { config } = response
        if (!isRefreshing) {
            isRefreshing = true
            return refreshToken().then(res=> {
                const { access_token } = res.data
                setToken(access_token)
                config.headers.Authorization = `${access_token}`
                // Execute the method of the array after the token is refreshed
                requests.forEach((cb) => cb(access_token))
                requests = [] // empty array
                return instance(config)
            }).catch(err => {
                console.log('Sorry, your login status has expired, please log in again!')
                return Promise.reject(err)
            }).finally(() => {
                isRefreshing = false
            })
        } else {
            // Returns a Promise that did not resolve
            return new Promise(resolve => {
                // Store resolve in the form of a function, wait for the refresh before executing
                requests.push(token => {
                    config.headers.Authorization = `${token}`
                    resolve(instance(config))
                })  
            })
        }
    }
    return response
})

// Add access_token to the request header
const setHeaderToken = (isNeedToken) => {
  const accessToken = isNeedToken ? getToken() : null
  if (isNeedToken) { // api requests need to carry access_token
    if (!accessToken) { 
      console.log('If there is no access_token, jump back to the login page')
    }
    instance.defaults.headers.common.Authorization = `${accessToken}`
  }
}

// Some APIs do not require user authorization to use, so there is no need to carry access_token; it is not carried by default, and if it needs to be passed, set the third parameter to true
export const get = (url, params = {}, isNeedToken = false) => {
  setHeaderToken(isNeedToken)
  return instance({
    method: 'get',
    url,
    params,
  })
}

export const post = (url, params = {}, isNeedToken = false) => {
  setHeaderToken(isNeedToken)
  return instance({
    method: 'post',
    url,
    data: params,
  })
}

export const deleteReq = (url, params = {}, isNeedToken = true) => {
  setHeaderToken(isNeedToken)
  return instance({
    method: 'delete',
    url,
    data: params,
  })
}