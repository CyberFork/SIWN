
/*
 * @Author: nfgate.io
 * @Date: 2022-06-15 18:54:06
 * @LastEditors: nfgate.io
 * @LastEditTime: 2022-07-15 16:30:59
 * @Description: 
 * May us have the power to create souls while striking the keyboard.
 */
/*
 * @Author: nfgate.io
 * @Description: nfgate.io/gate/?target={targetApp} e.g. nftrust.cc
 * 
 * Copyright (c) 2022 by nfgate.io, All Rights Reserved. 
 */

// set the times for your APP try to connect NFGate.io.
let maxTryConnectTimes = 10
// set the interval for connect to NFGate.io.
let intervalTime = 2000

/**
 * @description: Call this function where users click the button to sign in.
 * @return {*}
 */
export function clickSiwnButton(processAuthData = (data) => {console.log("nfgate data: ", data)}) {
	
	openNFGate(processAuthData)
}
// e.g. Your processAuthData in other files
/**
 * @description: When the sign-in window of NFGate.io returns authData, this function will be called.
 * @return {*}
 */
// function processAuthData(authData) {


// 	// console.log(authData)
// 	// ... do something with authData.

// 	//  close nfgate.io login window.


// }


// -------------------------internal function-----------------------------------

// Do not modify the following code.
const isTest = true
// const isTest = false
export const CONNECT_SUCCESS_TAG = 'NFGate.io: STEP1-connection succeeds.'
export const SIWN_STRING = "SIWN: STEP1-Establish connection."
export const NFGATE_HOST =  isTest? "http://localhost:3000" : "https://nfgate.io"
let NFGateWindow
let connectInterval
let tryConnectTimes

/**
 * @description: Open the login window of NFGate.io.
 * @param {function} callback Pass in a service function
 * @return {*}
 */
function openNFGate(callback) {
	// For verify the sourceURL equals to your app's url.
	// host = hostname+‘:' + port(not 80)
	// Get source host
	let sourceURL = window.location.host
	// Open nfgate window
	NFGateWindow = window.open(`${NFGATE_HOST}/?target=` + sourceURL)

	// Set postmessage interval heartbeat
	connectInterval = window.self.setInterval(touchNFGate, intervalTime)
	// Add listener
	addNFGateListener(callback)
}

/**
 * @description:  Connect the login window of NFGate.io.s
 * @return {*}
 */
function touchNFGate() {
	sendMessageToNFGate(SIWN_STRING)
	// Connect more than ten times will give up.
	tryConnectTimes > maxTryConnectTimes ? closeNFGate() : tryConnectTimes++
}

/**
 * @description: 
 * @param {*} message hello message from your app.
 * @return {*}
 */
function sendMessageToNFGate(message) {
	NFGateWindow && NFGateWindow.postMessage(message, NFGATE_HOST)
}

/**
 * @description:  close the NFGate.io window.
 * @return {*}
 */
function closeNFGate() {
	clearInterval(connectInterval)
	connectInterval = 0
	NFGateWindow && NFGateWindow.close()
}

/**
 * @description:  Recieve the message from NFGate.io.
 * @return {*}
 */
function addNFGateListener(callback) {
	window.addEventListener('message', e => {
		if (e.origin === NFGATE_HOST) {
			if (connectInterval && e.data === CONNECT_SUCCESS_TAG) {
				// If connect to NFGate.io successfully, clear the connect interval.
				console.log("SIWN: NFGate.io heartbeat.")
				tryConnectTimes = 0
			} else if (e.data !== CONNECT_SUCCESS_TAG) {
				// receive the authData from NFGate.io.
				callback(e.data)
				closeNFGate()
			}
		}
	})

}

