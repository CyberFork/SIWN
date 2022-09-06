// import ethUtil from 'ethereumjs-util';
import detectEthereumProvider from '@metamask/detect-provider';


export function fillParams(str: string, obj: any) {
    return str.replace(/\{(.*?)\}/g, (match, key) => obj[key]);
}

export const getRandomColor = () => {
    return Math.floor(Math.random() * 255)
}
export const getRandomColorString = () => {
    return `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`
}

export function ellipseId(
    address: string = "",
    width: number = 6
): string {
    return address.length > 6 ? `...${address.slice(-width)}` : address;
}

export function ellipseAddress(
    address: string = "",
    width: number = 10
): string {
    if (address.length < 5) return address
    return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function peelOrigin(url: string) {
    if (!url) return
    var reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
    return url.match(reg)![2] + url.match(reg)![3]
}


/**
 * Send signed message
 */
const sendSignMessage = async () => {

    const provider = await detectEthereumProvider();
    if (provider) {
        // MetaMask no longer injects web3. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
        const froms: string[] = await window.ethereum.request({ method: 'eth_accounts' });
        const from = froms[0];
        const msgParams = processSignMessage(from);
        // console.log(sigUtil.TypedDataUtils.sign(JSON.parse(msgParams)));

        var params = [from, msgParams];
        var method = 'eth_signTypedData_v4';

        window.ethereum.sendAsync(
            {
                method,
                params,
                from,
            },
            function (err: any, result: any) {
                if (err) return console.dir(err);
                if (result.error) {
                    alert(result.error.message);
                }
                if (result.error) return console.error('ERROR', result);
                console.log('TYPED SIGNED:' + JSON.stringify(result.result));


                // fromAddress
                // const recovered = sigUtil.recoverTypedSignature_v4({
                //     data: JSON.parse(msgParams),
                //     sig: result.result,
                // });

                // if (
                //     ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)
                // ) {
                //     console.log(recovered);
                //     alert('Successfully recovered signer as ' + from);
                // } else {
                //     alert(
                //         'Failed to verify signer when comparing ' + result + ' to ' + from
                //     );
                // }
            }
        );
    } else {
        console.log('Please install MetaMask!');
    }

};

const sendSignMessageParams = async (contents: string) => {

    const provider = await detectEthereumProvider();
    if (provider) {
        // MetaMask no longer injects web3. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
        const froms: string[] = await window.ethereum.request({ method: 'eth_accounts' });
        const from = froms[0];
        const msgParams = processSignMessageParam(from, contents);
        console.log("msgParams", msgParams)
        var params = [from, msgParams];
        var method = 'eth_signTypedData_v4';

        window.ethereum.sendAsync(
            {
                method,
                params,
                from,
            },
            function (err: any, result: any) {
                if (err) return console.dir(err);
                if (result.error) {
                    alert(result.error.message);
                }
                if (result.error) return console.error('ERROR', result);
                console.log('TYPED SIGNED:' + JSON.stringify(result.result));

                // fromAddress
                // const recovered = sigUtil.recoverTypedSignature_v4({
                //     data: JSON.parse(msgParams),
                //     sig: result.result,
                // });

                // if (
                //     ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)
                // ) {
                //     console.log(recovered);
                //     alert('Successfully recovered signer as ' + from);
                // } else {
                //     alert(
                //         'Failed to verify signer when comparing ' + result + ' to ' + from
                //     );
                // }
            }
        );
    } else {
        console.log('Please install MetaMask!');
    }

};


export function isAddress(hexAddress:string){
    return /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
}

export function shortAddress(address: string) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4, address.length)}`
}
export function shortAddressLength(address: string, length: number) {
    if (address.length > length)
        return `${address.substring(0, length)}...${address.substring(address.length - 4, address.length)}`
    return address
}
export function shortName(name: string, length: number) {
    if (name.length > length)
        return `${name.substring(0, length)}...`
    else
        return name
}

/**
 * Construct a signed message
 * 
 * @param from from address
 * @returns 
 */
function processSignMessage(from: string, chainId: number = 1) {

    return JSON.stringify({

        domain: {
            // Defining the chain aka Rinkeby testnet or Ethereum Main Net
            chainId: chainId,
            // Give a user friendly name to the specific contract you are signing for.
            name: 'Confirm that it is you',
            // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
            verifyingContract: '0xD5c6CC6b9c7824b893F8B4a5cD9DA757F9dB0fBF',
            // Just let's you know the latest version. Definitely make sure the field name is correct.
            version: '1',
        },

        // Defining the message signing data content.
        message: {
            /*
             - Anything you want. Just a JSON Blob that encodes the data you want to send
             - No required fields
             - This is DApp Specific
             - Be as explicit as possible when building out the message schema.
            */
            contents: 'Confirm to login',
        },
        primaryType: 'Message',
        types: {
            // : Clarify if EIP712Domain refers to the domain the contract is hosted on
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            // Refer to PrimaryType
            Message: [
                { name: 'contents', type: 'string' },
            ],
        },

    });
}

/**
 * Construct a signed message
 * 
 * @param from from address
 * @returns 
 */
function processSignMessageParam(from: string, contents: string, chainId: number = 1) {

    return JSON.stringify({

        domain: {
            // Defining the chain aka Rinkeby testnet or Ethereum Main Net
            chainId: chainId,
            // Give a user friendly name to the specific contract you are signing for.
            name: 'Confirm that it is you',
            // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
            verifyingContract: '0x448c3a27ba49d7af93c272513db3543ee3a95354',
            // Just let's you know the latest version. Definitely make sure the field name is correct.
            version: '1',
        },

        // Defining the message signing data content.
        message: {
            msg: contents
        },
        // Refers to the keys of the *types* object below.
        primaryType: 'Message',
        types: {
            //: Clarify if EIP712Domain refers to the domain the contract is hosted on
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],

            // Refer to PrimaryType
            Message: [{ name: "msg", type: 'string' }],
        },

    });
}

export { sendSignMessage, sendSignMessageParams };

