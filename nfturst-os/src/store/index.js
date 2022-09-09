import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { batchRemoveStorage, getStorage } from '../utils/localStorage';
const { confirm } = Modal;
const dataLocale = {
    lang: 'en'
};
const dataModal = {
    isPostModalVisible: false,
    isProfileVisible: false,
    isWalletVisible: false,
    isLoginModalVisible: false,
    isActiveLoginPromptAnimation: false,
    data: {
        type: 0,
        title: '',
        content: ''
    }
};

const commentData = {
    currentReplyNftCode: '123'
}
const dataUser = {
    isLogin: false,
    unread: 0,
    userInfo: {
        banner: '',
        address: '',
        header: '',
        displayName: '',
        addressList: [],
        nftCode: '',
        tokenId: '',
        contract: '',
        chainName: '',
        chainId: 1,
        bio: '',
        tokenUri: '',
        username: '',
        name: '',
        symbol: '',
        userAddress: '',
        myFollowersCount: 0,
        toFollowersCount: 0,
        userLinks: [],
        unid:'',
        addTweet: false
        
    }
};

const dataNfGate = {
    nfGateData: {
        signDatas: {
            signedData: "",
            signArgs: {
                timestamp: 0,
                walletAddress: ""
            },
            signTemplate: ""
        },
        nfList: []
    },
    isDataReady: false
}



export function comment(state = commentData, action) {
   if(action.type === 'setCurrentReplyNftCode') {
    
        console.log("in the setCurrentReplyNftCode:", action.currentReplyNftCode)
        return Object.assign({}, state,{ currentReplyNftCode: action.currentReplyNftCode });
        // return {...state, commentData: {...state.commentData, currentReplyNftCode: action.currentReplyNftCode}}
   }
   return state
}

function nfGate(state = dataNfGate, action) {

    if (action.type === 'seNfGateData') {
        return Object.assign({}, state, {
            nfGateData: action.data,
            isDataReady: true
        });
    }

    return state
}

function locale(state = dataLocale, action) {
    if (action.type === 'changeLocale') {
        document.documentElement.setAttribute('lang', action.lang || 'en');
        return {
            lang: action.lang || 'en',
        }
    }
    return state;
}

function modal(state = dataModal, action) {
    switch (action.type) {
        case 'activeLoginPromptAnimation':
            return Object.assign({}, state, { isActiveLoginPromptAnimation: true });
        case 'cancleLoginPromptAnimation':
            return Object.assign({}, state, { isActiveLoginPromptAnimation: false });
        case 'showLoginModal':
            return Object.assign({}, state, { isLoginModalVisible: true });
        case 'hideLoginModal':
            return Object.assign({}, state, { isLoginModalVisible: false });
        case 'showPostModal':
            return Object.assign({}, state, {
                isPostModalVisible: true,
                data: action.data || { type: 0, title: '' },
            });
        case 'hidePostModal':
            return Object.assign({}, state, {
                isPostModalVisible: false,
                data: { type: 0, title: '', content: ''}
            });
        case 'showProfileModal':
            return Object.assign({}, state, {
                isProfileVisible: true
            });
        case 'hideProfileModal':
            return Object.assign({}, state, {
                isProfileVisible: false
            });
        case 'showWalletModal':
            return Object.assign({}, state, {
                isWalletVisible: true
            });
        case 'hideWalletModal':
            return Object.assign({}, state, {
                isWalletVisible: false
            });
        default:
            return state
    }
}

function addAddress(list, address) {
    if (list.indexOf(address) === -1) {
        list.push(address);
    }
    return list;
}

function removeAddress(list, address) {
    let n = list.indexOf(address);
    if (n > -1) list.splice(n, 1);
    return list;
}

function user(state = dataUser, action) {
    let userInfo = state.userInfo;
  
    if (action.type === 'login') {
        userInfo = action.userInfo;
        return Object.assign({}, state, { isLogin: true, userInfo });
    } else if(action.type === "addTweet"){
        userInfo.addTweet = true
        return Object.assign({}, state, { userInfo });
    } else if(action.type === "resetAddTweet"){
        userInfo.addTweet = false
        return Object.assign({}, state, { userInfo });
    }
    else if (action.type === 'logout') {
        setTimeout(() => {
            batchRemoveStorage('token', 'myNft')

            document.location.reload()
        });
        return Object.assign({}, state, { isLogin: false });
    } else if (action.type === 'unlink') {
        userInfo.addressList = removeAddress(state.userInfo.addressList, action.address);
        userInfo.address = userInfo.addressList[0];
        return Object.assign({}, state, { userInfo });
    } else if (action.type === 'changeName') {
        userInfo.address = action.address;
        return Object.assign({}, state, { userInfo });
    } else if (action.type === 'updateUnread') {
        return Object.assign({}, state, { unread: action.unread });
    }else if(action.type === 'setUserlinks') {
        return  Object.assign({}, state, { userLinks: action.userLinks});
    }else if(action.type === 'setFollowersCount') {
        return Object.assign({}, state, { myFollowersCount: action.myFollowersCount,  toFollowersCount: action.toFollowersCount});
    }else if(action.type === 'setUserInfo'){
        return Object.assign({}, state, { userInfo: action.userInfo });
    }
    return state;
}

function makeAction() {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }
        return next(action);
    }
}

export function logout(dispatch) {
    confirm({
        title: 'Do you Want to log out?',
        icon: <ExclamationCircleOutlined />,
        cancelButtonProps: { shape: 'round', size: 'large' },
        okButtonProps: { shape: 'round', size: 'large' },
        onOk() {
            dispatch({ type: 'logout' })
        },
        onCancel() {

        },
    });
}


const ru = combineReducers({ locale, modal, user, nfGate, comment });

const store = createStore(ru, {}, applyMiddleware(makeAction()));

export default store