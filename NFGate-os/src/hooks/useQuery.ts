import React, { useState, useEffect } from 'react';
import { TTL } from "../constant/config";



const useQuery = async (url: string, reqData: any) => {

    return await fetch(url, reqData)
        .then(response => response.json())
        .then(data => data);
}

export const login = async (userAddress: string, signature: string, message: string) => {
    const header = new Headers()
    header.append("accept", "application/json, text/plain, */*")
    header.append("accept-language", "zh-CN,zh;q=0.9,en;q=0.8")
    // header.append("cache-control", "no-cache");
    header.append("content-type", "application/json")
    // header.append(
    //   "Authorization",
    //   localStorage.getItem("Authorization")!.toString()
    const url = `https://nfchat.io/nfgate/login`;
    const queryData = {
        userAddress,
        signature,
        message,
        ttl: TTL
    }
    const query = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(queryData)
    }
    const rdata = await useQuery(url, query)
    console.log("rdata:", rdata)
    checkLoginResponse(rdata)
    localStorage.setItem("Authorization", (rdata as any).token)
    return rdata
}

const checkLoginResponse = (response: any) => {
    // checkState
    if (!checkRespnseState(response)) return

    // check data
    if (!checkRespnseData(response)) return
}

const checkRespnseState = (response: any) => {
    return true
}
const checkRespnseData = (response: any) => {

    return true
}


export const getNftList = async (pageNum: number, pageSize: number, nftAddress: string) => {
    const authorization = localStorage.getItem("Authorization")
    if (!authorization) return

    const header = new Headers()
    header.append("accept", "application/json, text/plain, */*")
    header.append("accept-language", "zh-CN,zh;q=0.9,en;q=0.8")
    header.append("cache-control", "no-cache")
    header.append("content-type", "application/json")
    header.append("Authorization", authorization)



    const url = `/getUserNFTList?pageNum=${pageNum}&pageSize=${pageSize}&nftAddress=${nftAddress}`;
    const query = {
        method: 'GET',
        headers: header
    }

    const rdata = await useQuery(url, null);
    console.log(rdata);
    checkNftListResponse(rdata)
}

const checkNftListResponse = (response: any) => {
    // checkState
    if (!checkRespnseState(response)) return

    // check data
    if (!checkRespnseData(response)) return

}

export const loginNft = async () => {

    // ==========if authorization===========
    const authorization = localStorage.getItem("Authorization")
    if (!authorization) return
    // =====================================

    // get & check nftCode
    const NFTCode = ""

    const header = new Headers()
    header.append("accept", "application/json, text/plain, */*")
    header.append("accept-language", "zh-CN,zh;q=0.9,en;q=0.8")
    header.append("cache-control", "no-cache")
    header.append("content-type", "application/json")

    // ==========if authorization===========
    header.append("Authorization", authorization)
    // =====================================

    const url = `/login`;

    const queryData = {
        NFTCode
    }

    const query = {
        method: 'POST',
        headers: header,
        data: JSON.stringify(queryData)
    }
    const rdata = await useQuery(url, query)
    console.log(rdata)
    checkLoginResponse(rdata)
    localStorage.setItem("Authorization", (rdata as any).token)
    return rdata
}
