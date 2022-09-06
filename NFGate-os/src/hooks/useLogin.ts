import { useCallback, useEffect, useRef, useState } from "react";
import loginStore, { LoginRequestData } from "../store/LoginStore";
import maskStore from "../store/maskStore";
import web3Store from "../store/Web3Store";
import { fillParams } from "../utils/Web3Utils";
import { isEqual } from "lodash";
import { Bins } from "../utils/HttpRequest";
import { useLinkClickHandler } from "react-router-dom";

interface SigDataFromStr {
  isSusscess: boolean;
  signData: LoginRequestData | null;
  signDataList: LoginRequestData[] | null;
}

function getJwtObj(account: string) {
  const bins: Bins = JSON.parse(localStorage.getItem("bins") as string);
  console.log(`${account} bins is :`, bins);
  const jwt = bins?.tokens?.[account.toUpperCase()];
  return { jwt, bins };
}

function getSignDataFromSigdataListStr(
  str: string,
  account: string
): SigDataFromStr {
  const badReturn = { isSusscess: false, signData: null, signDataList: null };
  let list;

  try {
    list = JSON.parse(str);
  } catch (error) {
    return badReturn;
  }

  if (!list || !Array.isArray(list)) return badReturn;
  if (list.length === 0) return badReturn;

  const signDataFilterResult = list.filter(
    (i) => i.userAddress.toUpperCase() === account.toUpperCase()
  );
  if (signDataFilterResult.length > 0)
    return {
      isSusscess: true,
      signData: signDataFilterResult[0],
      signDataList: list,
    };
  else return badReturn;
}

function removeJWT(account: string) {
  const { jwt, bins } = getJwtObj(account);
  console.log("test removeJWT 1");
  if (!jwt || !jwt.token) return false;
  console.log("test removeJWT 2");

  console.log("test removeJWT before remove bins value:", bins);
  delete bins.tokens[account.toLocaleUpperCase()];
  console.log("test removeJWT 3");
  console.log("test removeJWT after remove bins value:", bins);
  localStorage.setItem(
    "bins",
    JSON.stringify({ ...bins, tokens: bins.tokens })
  );
  return true;
}

function checkJWT(account: string) {
  console.log("in checkJWT");
  const JWTObj = getJwtObj(account).jwt;
  console.log("JWTobj is ", JWTObj);
  if (!JWTObj?.token) return false;

  console.log("JWTobj expiration ", JWTObj.expiration);
  console.log(
    "JWTObj.expiration < new Date().getTime()",
    JWTObj.expiration < new Date().getTime()
  );
  if (JWTObj.expiration < new Date().getTime()) return false;

  return true;
}
const useLogin = () => {
  const [reqData, setReqData] = useState<LoginRequestData>(null);
  const ref = useRef<LoginRequestData>(null);

  const signMsgCallback = useCallback(async () => {
    console.log("in the useLogin signMsgCallback");

    const text = web3Store.messageToSignInner;
    console.log("sign text is ", text);
    const timestamp = new Date().getTime();
    const fillText = fillParams(text, {
      timestamp,
      walletAddress: web3Store.account,
    });
    console.log("fillText:", fillText);
    const result = await web3Store.signMsg(fillText);
    console.log("result", result);
    const sigData = {
      userAddress: web3Store.account,
      signature: result,
      timestamp: timestamp,
      target: "",
    };

    setReqData(sigData);

    const sigDataListStr = localStorage.getItem("sigDataList");
    let sigDataList: LoginRequestData[];
    if (!sigDataListStr) {
      sigDataList = [];
    } else {
      sigDataList = JSON.parse(sigDataListStr);
    }

    let count = 0;
    sigDataList.map((item) => {
      console.log("item:", item);
      if (item?.userAddress.toUpperCase() === web3Store.account.toUpperCase()) {
        count = count + 1;
        return sigData;
      }
    });

    if (count === 0) {
      sigDataList.push(sigData);
    }

    if (count > 1) {
    }

    localStorage.setItem("sigDataList", JSON.stringify(sigDataList));
  }, [web3Store.messageToSignInner, web3Store.account]);

  const logout = useCallback(async () => {
    if (!web3Store.account) return;
    removeJWT(web3Store.account);
    web3Store.setAccount("");
    loginStore.setIsSuccess(false);
  }, [web3Store.account]);

  useEffect(() => {
    web3Store.connectWallet();
    console.log("in the useLogin useEffect");
    if (!web3Store.account) return;
    if (!checkJWT(web3Store.account)) {
      setTimeout(async () => {
        await signMsgCallback();
      }, 300);
    } else {
      const sigDataListStr = localStorage.getItem("sigDataList");

      if (!sigDataListStr) return;

      const {
        isSusscess,
        signData,
        signDataList,
      } = getSignDataFromSigdataListStr(sigDataListStr, web3Store.account);

      if (isSusscess) {
        console.log("setReqData");
        //setReqData(signData)
        loginStore.setIsSuccess(true);
      } else {
        //if(removeJWT(web3Store.account)) {
        setTimeout(async () => {
          await signMsgCallback();
        }, 300);
        //}
        return;
      }
    }
    return () => setReqData(null);
  }, [web3Store.account]);

  useEffect(() => {
    if (!reqData) return;
    let _reqData = reqData;
    console.log("in the reqData useEffect");
    if (isEqual(_reqData, ref.current)) return;
    console.log("in the isEqual require");
    ref.current = _reqData;

    loginStore.setIsSuccess(false);
    maskStore.setIsMask(true);
    loginStore
      .login(_reqData)
      .then((res) => {
        if (res) loginStore.setIsSuccess(true);
      })
      .finally(() => {
        maskStore.setIsMask(false);
      });
  }, [reqData, loginStore.reqData]);

  return logout;
};

export default useLogin;
