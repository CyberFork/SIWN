import { useCallback, useEffect } from "react"
import {getAllFollowers} from "../api"

function UserGetNftFollowers(nftCode) {
    
    const getNftFollowers = useCallback(async (nftCode)=>{
        return  await getAllFollowers(nftCode).then((res)=>{
            console.log("userGetNftFollowers:", res)
            return getMyFollowersCountAndToFollowersCount(res.data)
        }) 
    }
    ,[])

    useEffect(()=>{
        if(!nftCode) return 0 
        return getNftFollowers(nftCode)
    },[
        nftCode
    ])
    
}

function getMyFollowersCountAndToFollowersCount(allFlollowersList){
    let myFollowersCount, toFollowersCount
    if(!allFlollowersList || allFlollowersList.length < 1) {
        myFollowersCount = 0
        toFollowersCount = 0
    }else{

       myFollowersCount = allFlollowersList.filter( f => f.relationType === 1).length
       toFollowersCount = allFlollowersList.filter( f => f.relationType === 2).length
       
    }
    return {myFollowersCount, toFollowersCount}
}

export default UserGetNftFollowers