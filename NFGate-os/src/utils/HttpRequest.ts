import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { timeStamp } from "console";
import API from "../api/API";
import { isEmpty } from "lodash"
import { TOKEN_TTL } from "../constant/config";
import WEB3 from "web3"
import web3Store from "../store/Web3Store"
const exclude_api = ["/api/loginCode", "/api/serverInfo"];

export interface Bins {
  tokens: { [key: string]: { token: string, expiration: number } }
}

interface RequestOptions {
  url: string,
  data?: any,
  method: string,
  options?: AxiosRequestConfig,
  contentType?: string, // json || urlencoded || multipart
  prefixUrl?: string,
}

const instance = axios.create({
  timeout: 5000,
});

const requestInterceptor = instance.interceptors.request.use((req) => {
  // remove the starting part / all request urls take relative paths
  req.url = req.url!.replace(/^\//, "");
  return req;
});
const isExpired = (expiration: number) => {
  return new Date().getTime() > expiration
}

// response interceptor
const responseInterceptor = instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === "401") {
     // Login verification failed
      const err: Object = {
        url: response.config.url,
        type: "Unauthorized",
        respMsg: "Unauthorized.",
      };
      Promise.reject(err);
    } else if (data.code === "403") {
      // No permission
      return Promise.reject();
    } else {
      if (response.config.url!.includes(API.LOGIN)) {
        console.log("user address:", JSON.parse(response.config.data).userAddress)
        const binstr = localStorage.getItem('bins')
        console.log("resp binstr", binstr)
        const bins = !binstr? {tokens: {}} :JSON.parse(localStorage.getItem('bins') ?? "") ?? { tokens: {} }
        console.log("response:", response)
        localStorage.setItem("bins", JSON.stringify({
          tokens: { ...bins.tokens, [JSON.parse(response.config.data).userAddress.toUpperCase()]: { token: response.data.data.t, expiration: new Date().getTime() + TOKEN_TTL } }
        }))
      }
      return Promise.resolve(data);
    }
  },
  (error) => {
    if (error.response) {
      const { data } = error.response;
      const resCode = data.status;
      const resMsg = data.message || "Service error.";
      const err: Object = { code: resCode, respMsg: resMsg };
      return Promise.reject(err);
    } else {
      console.error(error);
      const err = { type: "canceled", respMsg: "Service unavailable." };
      return Promise.reject(err);
    }
  }
);

export class HttpRequest {

  /*
   * websocket
   */
  public static channel: string = "wss://www.nashservers.com/channel";

  /*
   * base path
   */
  private base_path: string = "https://nfchat.io/nfgate";

  private contentTypes: any = {
    json: "application/json; charset=utf-8",
    urlencoded: "application/x-www-form-urlencoded; charset=utf-8",
    multipart: "multipart/form-data",

  };

  private defaultOptions: AxiosRequestConfig = {
    // Allow cookies to be passed to the backend (provided that the backend service must set a specific Access-Control-Allow-Origin)
    // withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": this.contentTypes.json,
    },
    timeout: 15000,
  };

  /*
   * axios
   */
  private instance: AxiosInstance = instance;

  /*
   *The instance
   */
  public static http: HttpRequest = new HttpRequest();

  public static getChannel() {
    return this.channel;
  }

  public static getInstance() {
    if (this.http === null) {
      this.http = new HttpRequest();
    }
    return this.http;
  }

  /*
   *@Author: yozora
   *@Description: Call the API
   *@Date: 2021-09-16 18:50:13
   */
  public request = async  (requestOptions: RequestOptions) => {
    if (!requestOptions.url) {
      const error = new Error("Please input url.");
      return Promise.reject(error);
    }
    const fullUrl = requestOptions.prefixUrl !== undefined ? `${this.base_path}/${requestOptions.prefixUrl}${requestOptions.url}` : `${this.base_path}${requestOptions.url}`;
    const userAddress = web3Store.account
    // load JWT
    const binstr = localStorage.getItem("bins")
    console.log("binstr:", binstr)
    const userToken = binstr? (JSON.parse(binstr  ?? '') as Bins).tokens[userAddress.toUpperCase()]:null
    console.log("userToken:", userToken)
    let token:string = !!binstr ? !userToken? '' : isExpired(Number(userToken.expiration))? '': userToken.token : ''
 
    const newOptions: any = {
      ...this.defaultOptions,
      ...requestOptions.options,
      headers: {
        "Content-Type":
          (requestOptions.options?.headers && requestOptions.options.headers["Content-Type"]) ||
            requestOptions.contentType !== undefined ? this.contentTypes[requestOptions.contentType!] : this.contentTypes.json,
        Authorization: token
      },
      method: requestOptions.method,
    };
    console.log("newOptions:", newOptions)
    if (requestOptions.method === "get") {
      newOptions.params = requestOptions.data;
    }

    if (requestOptions.method !== "get" && requestOptions.method !== "head") {
      if (requestOptions.data instanceof FormData) {
        newOptions.data = requestOptions.data;
        newOptions.headers = {
          "x-requested-with": "XMLHttpRequest",
          "cache-control": "no-cache",
        };
      } else if (
        newOptions.headers["Content-Type"] === this.contentTypes.urlencoded
      ) {
        newOptions.data = requestOptions.data;
      } else {
        Object.keys(requestOptions.data).forEach((item) => {
          if (
            requestOptions.data[item] === null ||
            requestOptions.data[item] === undefined ||
            requestOptions.data[item] === ""
          ) {
            delete requestOptions.data[item];
          }
        });
        newOptions.data = requestOptions.data;
      }
    }

    return this.instance({
      url: fullUrl,
      ...newOptions,
    });
  };
}
