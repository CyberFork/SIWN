import {batchRemoveStorage} from "../utils/localStorage"
export function useClearStorageByKeys(...keys){
    batchRemoveStorage(keys)
}