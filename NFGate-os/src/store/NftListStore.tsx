import { makeAutoObservable, observable } from "mobx";
import { CHAINID_TO_CHAININFO } from "../constant/chains";
import { HttpRequest } from "../utils/HttpRequest";
// import {query} from "../hooks/useQuery";
export interface Item { itemId: number, chainId: number, contract: string, tokenIds: string[] }
export interface AddNftMessage {msg: string, address:string, tokenId: string,  chainId: number}
interface Req {
  pageNum: number
  pageSize: number
  NFTAddress?: string
}

interface Platform {
  clusterCode: string
  platformName: string
  platformUrl: string
}
export interface UnidData { unid: string, chainName: string, chainId: number, contract: string, tokenId: string }
export interface UnidDataWithCode { unid: string, chainName: string, chainId: number, contract: string, tokenId: string, nftCode: string }

interface NftListResData {
  name: string
  symbol: string
  tokenId: string
  NFTCode: string
  userAddress: string
  NFTAddress: string
  imageUrl: string
  animationUrl: string
  fromPlatform: string
  tokenMetadataUrl: string
  permalink: string
  bio: string
  platformList: Platform[]
}

// const InitNftListData: NftListResData[] = [{
//   name: "",
//   symbol: "",
//   tokenId: "",
//   NFTCode: "00",
//   userAddress: "00",
//   NFTAddress: "00",
//   imageUrl: "",
//   animationUrl: "",
//   fromPlatform: "",
//   tokenMetadataUrl: "",
//   permalink: "",
//   bio: "",
//   platformList: [{
//     clusterCode: "",
//     platformName: "",
//     platformUrl: ""
//   }]
// }]
interface Filters {
  chainId?: number[]
  contract?: string[]
  keywords?: string[]
}
interface Filter {
  chainId?: number
  contract?: string
  keywords?: string
}

export interface NftContract {
  name: string,
  symbol: string
  networkName: string
  chainId: number
  nftAddress: string
  schemaName: string
  description: string
  imageUrl: string
  createdDate: string
}

class NfttListStore {
  addNftMessages: AddNftMessage[] = []
  selectedFilter: Filters = { chainId: [], contract: [], keywords: [] }
  userNftContracts: NftContract[] | null = null
  selectedNftList: UnidData[] = [];
  selectedNftWithCodeList: UnidDataWithCode[] = [];
  nftList: NftListResData[] | undefined;
  animated = true;
  StaticNFTContractList: NftListResData[] =
    [
      {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      },
      {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      }, {
        name: "BoredApeYachtClub",
        symbol: "BAYC",
        tokenId: "2815",
        NFTCode: "123123",
        userAddress: "0xB8DC9d4Bbeb6705FdBa1F89458a4bC2a2066a6c9",
        NFTAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        imageUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        animationUrl: "https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/preview/5695.png",
        fromPlatform: "",
        tokenMetadataUrl: "https://opensea.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5695",
        permalink: "https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5695",
        bio: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
        platformList: [{
          clusterCode: "",
          platformName: "Ethereum",
          platformUrl: ""
        }]
      },
    ]
  style = {}



  //: [{ showName: string, name: string, chainId: number, chainName: string, address: string, isSelected: boolean, isEditing: boolean, NftCreateTime: number, lastInteractionTime: number, imgURL: string }]
  constructor() {
    // responsive attribute
    makeAutoObservable(this, {
      addNftMessages: observable,
      nftList: observable,
      StaticNFTContractList: observable,
      animated: observable,
      style: observable,
      selectedNftList: observable,
      selectedNftWithCodeList: observable
    });
  }


  setSelectedFilterContrat = (_list: string[]) => {
    this.selectedFilter.contract = _list
  }

  addSelectedFilter = (filter: Filter) => {
    console.log("addSelectedFilter filter:", filter)
    if (!filter) return

    if (filter.chainId) {
      if (this.selectedFilter.chainId && this.selectedFilter.chainId.length > 0)
        this.selectedFilter.chainId = Array.from(new Set([...this.selectedFilter.chainId, filter.chainId]))
      else
        this.selectedFilter.chainId = [filter.chainId]
    }
    if (filter.contract) {
      if (this.selectedFilter.contract && this.selectedFilter.contract.length > 0) {
        console.log("addSelectedFilter this.selectedFilter.contract:", this.selectedFilter.contract)
        this.selectedFilter.contract = Array.from(new Set([...this.selectedFilter.contract, filter.contract.toUpperCase()]))
      }
      else {
        this.selectedFilter.contract = [filter.contract]
        console.log("[filter.contract]:", [filter.contract])

      }
    }
    if (filter.keywords) {
      if (this.selectedFilter.keywords && this.selectedFilter.keywords.length > 0)
        this.selectedFilter.keywords = Array.from(new Set([...this.selectedFilter.keywords, filter.keywords]))
      else
        this.selectedFilter.keywords = [filter.keywords]
    }

    console.log("addSelectedFilter this.selectedFilter:", this.selectedFilter)

  }


  removeSelectedFilter = (filter: Filter) => {
    if (!filter) return


    if (filter.chainId && this.selectedFilter.chainId) {
      this.selectedFilter.chainId = this.selectedFilter.chainId.filter(i => i !== filter.chainId)
    }

    console.log("removeSelectedFilter filter:", filter)
    if (filter.contract && this.selectedFilter.contract) {
      console.log("removeSelectedFilter filter:", filter.contract)
      this.selectedFilter.contract = this.selectedFilter.contract.filter(i => {
        console.log("removeSelectedFilter i:", i)
        return i.toUpperCase() !== filter.contract?.toUpperCase()
      })
    }

    if (filter.keywords && this.selectedFilter.keywords) {

      this.selectedFilter.keywords = this.selectedFilter.keywords.filter(i => i.toUpperCase() !== filter.keywords?.toUpperCase())

    }
    console.log("removeSelectedFilter selectedFilter.contract:", this.selectedFilter.contract)
  }

  clearContractFilter = () => {
    this.selectedFilter.contract = []
  }
  clearFilter = () => {
    this.selectedFilter = { chainId: [], contract: [], keywords: [] }
  }


  getStaticNftContractList = () => {
    return this.StaticNFTContractList;
  };

  getStyle = () => {
    return this.style
  }

  setStyle = (style: any) => {
    this.style = style;
  }

  getAnimated = () => {
    return this.animated
  }
  setAnimated = (isAnimated: boolean) => {
    this.animated = isAnimated
  }

  addUserNFT = async (items: Item[]): Promise<boolean> => {
    const nfts = items.map(i => { return {nftAddress: i.contract, nftTokenIds: i.tokenIds, chainId: i.chainId}})
    return await HttpRequest.getInstance().request({
      url: '/addUserNFT',
      method: 'POST',
      data: {addNftRequest: nfts}
    }).then(res => {
      console.log("addUserNFT res:", res)
      if(!res || !res.data || res.data.length === 0) return false
      console.log("addNftMessages", res.data)

      this.addNftMessages = res.data.map( (data: { nftAddress: any; tokenId: any; result: any; chainId?: number }) => {return {address: data.nftAddress, tokenId: data.tokenId, msg: data.result, chainId: data.chainId ? Number(data.chainId): 1}})
      return true
    }).catch(err => {
      console.log("err: ", err)
      return false
    })
  }

  getList = async (pageNum: number, pageSize: number): Promise<any[]> => {
    let chainIds = [1, 137, 56], nftAddresses: string[] = []

    if (this.selectedFilter.chainId && this.selectedFilter.chainId.length > 0) {
      chainIds = this.selectedFilter.chainId
    }

    if (this.selectedFilter.contract && this.selectedFilter.contract.length > 0) {
      nftAddresses = this.selectedFilter.contract
    }
    console.log("getList this.selectedFilter.contract:", this.selectedFilter.contract)
    return await HttpRequest.getInstance().request({
      url: '/getUserNFTList',
      method: 'POST',
      data: { pageNum, pageSize, nftAddresses, chainIds }
    }).then(res => {
      console.log(" getUserNFTList res:", res)
      this.nftList = res.data
      return res.data
    }).catch(err => {
      console.log("err: ", err)
      return err
    })
  }
  getUserNonFungibleTokenDescription = async (): Promise<boolean> => {
    let chainIds
    const chainId = this.selectedFilter.chainId
    
    if (!chainId || chainId.length === 0)
      chainIds = [1, 137, 56]
    else
      chainIds = chainId

    return await HttpRequest.getInstance().request({
      url: '/getUserNonFungibleTokenDescription',
      method: 'POST',
      data: { chainIds }
    }).then(res => {
      console.log(" getUserNonFungibleTokenDescription res:", res)

      this.userNftContracts = res.data

      // if (this.selectedFilter.contract && this.selectedFilter.contract.length === 0){

      this.selectedFilter.contract = res.data.map((i: NftContract) => i.nftAddress.toUpperCase())
      // }
      if (res.data)
        return true
      else return false
    }).catch(err => {
      console.log("err: ", err)
      return false
    })
  }

  addSelectedNft = (unid: UnidDataWithCode) => {
    this.selectedNftWithCodeList.push(unid)
    this.selectedNftList.push({ unid: unid.unid, chainId: unid.chainId, chainName: unid.chainName, tokenId: unid.tokenId, contract: unid.contract })
    console.log(" this.selectedNftList:", this.selectedNftList)
  }

  removeSelectedNft = (unid: string) => {
    this.selectedNftWithCodeList = this.selectedNftWithCodeList.filter(n => n.unid !== unid)
    this.selectedNftList = this.selectedNftList.filter(n => n.unid !== unid)
  }

  getSelectedNftCodeList = (): string[] => {
    return this.selectedNftWithCodeList.map(unid => unid.nftCode)
  }


}
const nftListStore = new NfttListStore();
export default nftListStore;
