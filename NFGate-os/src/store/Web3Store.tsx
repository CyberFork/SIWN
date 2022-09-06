import Web3Modal from "web3modal";
import Web3 from "web3";
import { makeAutoObservable, observable } from "mobx";
import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min.js";
import { ethers } from "ethers";
import { apiGetAccountAssets } from "../utils/helpers2/api";
import { SUPPORT_EVM_CHAINS, CHAINID_TO_CHAININFOS } from "../constant/chains"

class Web3Store {
  ens = null
  //provider = null
  isConnected = false;
  web3: any;
  account = "";
  signer: any;
  web3Modal: any;
  fetching = false;
  chainId = 0;
  networkId = 0;
  messageToSignInner = "I want to authenticate with nfgate.io and generate a JWT token at timestamp: {timestamp} to prove that I am the owner of the following wallet address: {walletAddress} to fetch NFT list to SIWN(Sign-in with NFT) dapps. Signature transactions do not affect your assets in any way.";
  messageToSignOut = "I want to authenticate with nfgate.io at timestamp: {timestamp} to prove that I am the owner of the following wallet address: {walletAddress} to select NFT to SIWN(Sign-in with NFT): {target}. Signature transactions do not affect your assets in any way.";
  constructor() {
    // responsive attribute
    makeAutoObservable(this, {
      account: observable,
      isConnected: observable,
      web3: observable,
      chainId: observable,
      messageToSignInner: observable,
      messageToSignOut: observable,
      web3Modal: observable,
      //provider: observable,
      ens: observable

    });
  }

  setEns = (_ens: any) => {
    this.ens = _ens
  }

  signMsg = async (msg: string) => {
    if (!this.web3) return
    // return (await this.web3.eth.accounts.sign(msg, "c0173806cdf6ed4f49a10ca594dd8d40a0daf85411f8ed7f9c7e59727182990a"))
    return await this.web3.eth.personal.sign(
      msg,
      this.account,
      "",
      async (error: string, result: string) => {
        const address = await this.web3.eth.personal.ecRecover(msg, result);
        if (this.web3.utils.toChecksumAddress(address) === this.web3.utils.toChecksumAddress(this.account)) {
          console.log("address === this.accounaddress === this.accounaddress === this.accounaddress === this.accoun")
          return result
        }
        return ""
      }
    );
  };

  changeNetwork = async (chainId: number,) => {
    if (this.chainId == chainId) return;
    window.ethereum &&
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: '0x' + chainId.toString(16),
            },
          ],
        })
        .then(() => {
          console.log("Network changed");
        })
        .catch(async (e: string) => {

          await window.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: '0x' + chainId.toString(16),
                  chainName: CHAINID_TO_CHAININFOS[chainId].chainName,
                  nativeCurrency: {
                    name: CHAINID_TO_CHAININFOS[chainId].nativeCurrency,
                    symbol: CHAINID_TO_CHAININFOS[chainId].symbol,
                    decimals: 18,
                  },
                  rpcUrls: [`https://${CHAINID_TO_CHAININFOS[chainId].chainName}.infura.io/v3/`],
                  blockExplorerUrls: [`https://${CHAINID_TO_CHAININFOS[chainId].chainName}.etherscan.io/`],
                },
              ],
            })
            .then(() => {
              console.log("Network added");
            })
            .catch((e: any) => { console.log("Network add failed", e) });
        });

  }
  connectWallet = async () => {
   
   this.web3 = new Web3(window.ethereum);
  }


  initWeb3 = async (chainId: number) => {
    // change network if chainId is different

    const providerOptions = {
      /* See Provider Options Section */
      injected: {
        display: {
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png",
          name: "Injected",
          description: "Connect with the provider in your Browser",
        },
        package: null,
      },
      // Example with WalletConnect provider
      walletconnect: {
        display: {
          logo: "https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png",
          name: "Mobile",
          description: "Scan qrcode with your mobile wallet",
        },
        package: WalletConnectProvider,
        options: {
          infuraId: "INFURA_ID", // required
        },
      },
    };


    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    this.web3Modal = web3Modal;

    const instance = await web3Modal.connect();

    await this.subscribeProvider(instance);

    const provider = new ethers.providers.Web3Provider(instance);
    //this.provider = provider
    const signer = provider.getSigner();
    this.signer = signer;

    const web3: any = new Web3(instance);
    web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3.utils.hexToNumber,
        },
      ],
    });

    const thischainId = await web3.eth.chainId();
    if (thischainId != chainId) {
      await this.changeNetwork(chainId);
    }

    this.chainId = thischainId
    this.web3 = web3;
    this.isConnected = true;

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];
    this.account = address;

  };

  stopConnection = () => {
    this.isConnected = false;
  };

  // computed attribute
  get web3Provider() {
    return;
  }

  public resetApp = async () => {
    console.log("in the resetApp");
    const web3 = this.web3;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.resetState();
  };

  public resetState = () => {
    this.web3 = null;
    this.stopConnection();
    this.signer = null;
    this.account = "";
  };

  public subscribeProvider = async (provider: any) => {
    console.log("provider.on:", provider.on);
    if (!provider.on) {
      return;
    }
    provider.on(
      "disconnect",
      async (error: { code: number; message: string }) => {
        // console.log("disconnect")
        // await this.resetApp();
        // console.log(error);
      }
    );
    provider.on("close", () => this.resetState());
    provider.on("accountsChanged", async (accounts: string[]) => {
      console.log("accountsChanged", accounts[0])
      this.account = accounts[0];

      if (!this.account) this.resetState();
      //await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId: number) => {
      console.log("chainChanged", chainId);
      const web3 = this.getWeb3();
      if (!web3) return;
      const networkId = await web3.eth.net.getId();
      this.setChainId(chainId);
      this.setNetworkId(networkId);
      //await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId: number) => {
      const web3 = this.getWeb3();
      if (!web3) return;
      const chainId = await web3.eth.chainId();
      this.setChainId(chainId);
      this.setNetworkId(networkId);
      //await this.getAccountAssets();
    });
  };

  setNetworkId(networkId: number) {
    this.networkId = networkId;
  }

  getWeb3 = () => {
    return this.web3;
  };

  setChainId(chainId: number) {
    this.chainId = chainId;
  }

  setAccount(account: string) {
    this.account = account
  }

  public getAccountAssets = async () => {
    const address = this.account;
    const chainId = this.chainId;
    this.fetching = true;
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      this.stopFetching();
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.stopFetching();
    }
  };

  stopFetching = () => {
    this.fetching = false;
  };

  startFetching = () => {
    this.fetching = true;
  };

  // action
  // addCount = () => {
  //   this.count++
  // }
}
const web3Store = new Web3Store();
export default web3Store;
