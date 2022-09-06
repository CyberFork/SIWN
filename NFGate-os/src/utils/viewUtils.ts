export function typeOutput(setStringState: (str: string) => void, typingText: string): void {
  
    //   var typingText = "Hey xxx.eth(0xABC...123), please select a network where your NFTs are";
var count = 0;
// var $myBlock = "" //$("#myDiv");F

// useEffect(() => {
//     type()
// }, []);
async function type() {
    if (typingText[count] == " ") {
        await wait(500)
    }
    if (count <= typingText.length) {
        setStringState(typingText.substring(0, count));
        count++;
    } else {
        window.clearInterval(typewriter);
    }
}
var typewriter = window.setInterval(type, 85);
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(1), ms));
};
