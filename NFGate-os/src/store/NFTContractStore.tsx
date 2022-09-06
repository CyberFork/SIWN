import { makeAutoObservable, observable } from "mobx";
import { HttpRequest } from "../utils/HttpRequest";

interface Req {
  pageNum: number;
  pageSize: number;
}
class NftContractList {
  NftContractList: { name: string; address: string }[] = [];
  animated = true
  StaticNFTContractList = [
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
    {
      showName: "BoredApeYachtClub",
      description:
        "The Bored Ape Yacht Club (BAYC) is an Ethereum-based NFT collection of 10,000 unique Bored Apes. Each Bored Ape has a basket of traits programmatically generated from over 170 traits, including expression, clothing, headware, and more. ",
      name: "BAYC",
      chainId: 18,
      chainName: "Ethereum",
      address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      isSelected: false,
      isEditing: false,
      NftCreateTime: 1653120854,
      lastInteractionTime: 1653120854,
      imgURL:
        "https://media.wepg.online/public/images/user_9496/1644280103_080222080228230000006201b9275525c.jpg?x-oss-process=image/auto-orient,1/quality,q_85",
    },
  ];
  //: [{ showName: string, name: string, chainId: number, chainName: string, address: string, isSelected: boolean, isEditing: boolean, NftCreateTime: number, lastInteractionTime: number, imgURL: string }]
  constructor() {
    // responsive attribute
    makeAutoObservable(this, {
      NftContractList: observable,
      StaticNFTContractList: observable,
      animated: observable,
    });
  }

  getStaticNftContractList = (index: number) => {
    return this.StaticNFTContractList;
  };
  // action
  getNftContractList = async () => {
 
    return await this.getList();
  };

  getList = async () : Promise<any[]> => {
    return await HttpRequest.getInstance().request({
      url: 'trust/getUserNFTList',
      method: 'POST',
      data: { pageNum: 1, pageSize: 10 }
    }).then(res => {
      console.log(" getUserNFTList res:", res)
      return res.data
    }).catch(err => {
      console.log("err: ", err)
      return err
    })
  }
  // const a = await get15DaysWeatherByArea(data)
  // console.log("aaaaaa:",a)
}
const nftContractList = new NftContractList();
export default nftContractList;
