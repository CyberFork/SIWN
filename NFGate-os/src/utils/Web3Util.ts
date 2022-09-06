export class Web3Util {

    private static web3: Web3Util = new Web3Util();


    private constructor() {

    }

    public static getInstance() {
        return Web3Util.web3;
    }


}