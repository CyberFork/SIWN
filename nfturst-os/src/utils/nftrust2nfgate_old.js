
/*
 * @Author: nfgate.io
 * @Description: nfgate.io/gate/?target={targetApp} e.g. nftrust.cc
 * 
 * Copyright (c) 2022 by nfgate.io, All Rights Reserved. 
 */

import { login } from "../api"
import { batchRemoveStorage, getStorage, setStorage } from "../utils/localStorage"

// set the times for your APP try to connect NFGate.io.
let maxConnectTimes = 10
// set the interval for connect to NFGate.io.
let intervalTime = 2000

/**
 * @description: Call this function where users click the button to sign in.
 * @return {*}
 */
export function clickSiwnButton() {
	openNFGate(window.location.host)
}

/**
 * @description: When the sign-in window of NFGate.io returns authData, this function will be called.
 * @return {*}
 */
async function processAuthData(authData) {
	// ... do something with authData.
	batchRemoveStorage(["token", "myNft"])

	console.log(authData)
	authData = JSON.parse(authData)
	console.log(authData)
	console.log(" authData[signDatas]:", authData["signDatas"])
	const data = {
		signData: {
			userAddress: authData.signDatas.signArgs.walletAddress,
			signedData: authData.signDatas.signedData,
			timestamp: authData.signDatas.signArgs.timestamp,
			signTemplate: authData.signDatas.signTemplate,
			target: window.location.host
		},

		selectedNftDataList: authData.selectedNftDataList[0]
	}
	
	const res = await login(data)
	
	const userInfo = res.data.userInfo
	console.log("userInfo:",userInfo)
	setStorage("myNft",
	{
		nftCode: userInfo.nftCode,
		tokenId: userInfo.tokenId,
		contract: userInfo.contract,
		chainName: userInfo.chainName,
		chainId: userInfo.chainId,
		bio: userInfo.bio,
		tokenUri: userInfo.tokenUri,
		username: userInfo.username,
		nftName: userInfo.nftName,
		nftSymbol: userInfo.nftSymbol,
		userAddress: userInfo.userAddress,
		unid:`${userInfo.chainName}-${userInfo.chainId}-${userInfo.contract}-${userInfo.tokenId}`,
		banner: userInfo.banner
	})
	setStorage("token", res.data.t)
	setStorage("rtoken", res.data.r)
	document.location.reload()
}

// -------------------------internal function-----------------------------------

// Do not modify the following code.
let NFGateWindow
let connectInterval
let connectTimes
const CONNECTSUCCESS_TAG = 'NFGate.io: connectSuccess'

const HOST = "http://localhost:3000"
// const HOST = "https://nfgate.io"
/**
 * @description: Open the login window of NFGate.io.
 * @return {*}
 */
function openNFGate(sourceURL) {
	// For verify the sourceURL equals to your app's url.
	// NFGateWindow = window.open('https://nfgate.io/gate/?target=' + sourceURL)
	NFGateWindow = window.open(`${HOST}?target=` + sourceURL)
}

/**
 * @description: 
 * @param {*} message hello message from your app.
 * @return {*}
 */
function sendMessageToNFGate(message) {
	NFGateWindow && NFGateWindow.postMessage(message, HOST)
}

/**
 * @description:  close the NFGate.io window.
 * @return {*}
 */
function closeNFGate() {
	NFGateWindow && NFGateWindow.close()
}

/**
 * @description:  Recieve the message from NFGate.io.
 * @return {*}
 */
window.addEventListener('message', async e => {
	if (e.origin === HOST) {
		if (connectInterval && e.data === CONNECTSUCCESS_TAG) {
			// If connect to NFGate.io successfully, clear the connect interval.
			clearInterval(connectInterval)
			connectInterval = 0
		} else if (e.data !== CONNECTSUCCESS_TAG) {
			// receive the authData from NFGate.io.
			await processAuthData(e.data)
			//  close nfgate.io login window.
			closeNFGate()
		}
	}
})

/**
 * @description:  Connect the login window of NFGate.io.
 * @return {*}
 */
function connectNFGate() {
	sendMessageToNFGate('SIWN')
	// Connect more than ten times will give up.
	connectTimes > maxConnectTimes ? clearInterval(connectInterval) : connectTimes++
}

connectInterval = window.self.setInterval(connectNFGate, intervalTime)