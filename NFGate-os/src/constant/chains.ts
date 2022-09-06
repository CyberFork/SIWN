export const SUPPORT_EVM_CHAINS = [{ chainName: "ethererum", chainId: 0x1 }, { chainName: "polygon", chainId: 0x89 }, { chainName: "bsc", chainId: 0x38 }]

export const CHAINNAME_TO_CHAINID = {
    "ethererum": 0x1
}

export type CHAINID_TO_CHAININFO = {
    [chainId: number]: {
        chainName: string,
        chainId: number,
        nativeCurrency: string
        symbol: string,
        nickName: string,
        tailwindcss: string,
    }
}

export const CHAINID_TO_CHAININFOS: CHAINID_TO_CHAININFO = 
    {
        0x1: {
            chainId: 0x1,
            chainName: "Ethererum",
            nativeCurrency: "ETH",
            symbol: "ETH",
            nickName: "eth",
            tailwindcss: "text-gray-300 transition-all delay-500 duration-700 mx-4 group hover:text-black w-100 bg-gradient-to-r shadow-lg shadow-gray-600 from-gray-600 to-gray-400 hover:shadow-gray-600 hover:from-gray-600 hover:to-gray-400 hover:via-white rounded-md inline-flex items-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-2 px-4"
        },
        0x38: {
            chainId: 0x38,
            chainName: "BSC",
            nativeCurrency: "BNB",
            symbol: "BNB",
            nickName: "bsc",
            tailwindcss: "transition-all delay-500 duration-700 mx-4 text-gray-300 group hover:text-black bg-gradient-to-r shadow-lg shadow-yellow-700 from-yellow-500 to-gray-800 hover:from-yellow-500 hover:via-white hover:to-black rounded-md inline-flex items-center text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-2 px-4"
        },
        
        0x89 : {
            chainId: 0x89,
            chainName: "Polygon",
            nativeCurrency: "Matic",
            symbol: "Matic",
            nickName: "polygon",
            tailwindcss: "transition-alldelay-500 delay-500 duration-700 mx-4 text-gray-300 group hover:text-black shadow-lg bg-gradient-to-r  shadow-purple-800 from-purple-600  to-purple-400 hover:from-purple-600  hover:via-yellow-50 hover:to-purple-400 rounded-md inline-flex items-center text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-2 px-4"
        }
    }
  
       
  
