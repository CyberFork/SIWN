import { makeAutoObservable, observable } from 'mobx'

class MaskStore {

    isMask = false
    constructor() {
        // responsive attribute
        makeAutoObservable(this, { isMask: observable })
    }

    setIsMask(isMask: boolean) {
        console.log("isMask: boolean", isMask)
        this.isMask = isMask
    }

    getIsMask() {
        return this.isMask
    }

}

const maskStore = new MaskStore()
export default maskStore