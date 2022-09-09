
const Minutes = 60;
const Hour = 60 * Minutes;
const Day = 24 * Hour;
const Month = 30 * Day;
const Year = 12 * Month;
const LOCALE = {
    en: {
        s: 'seconds ago',
        d: 'days ago',
        m: 'minutes ago',
        h: 'hours ago',
        M: 'months ago',
        y: 'years ago'
    },
    zh: {
        s: '秒以前',
        d: '天以前',
        m: '分钟以前',
        h: '小时以前',
        M: '月以前',
        y: '年以前',
    }
};

export function timesAgo(timestamp, locale) {
    locale = locale || 'en';
    const now = Date.now();
    const diff = (now - timestamp) / 1000;
    if(diff < 60) return Math.floor(diff) + ' ' + LOCALE[locale].s;
    if(diff < Hour) return Math.floor(diff / Minutes) + ' ' + LOCALE[locale].m;
    if(diff < Day) return Math.floor(diff / Hour) + ' ' + LOCALE[locale].h;
    if(diff < Month) return Math.floor(diff / Day) + ' ' + LOCALE[locale].d;
    if(diff < Year) return Math.floor(diff / Month) + ' ' + LOCALE[locale].M;
    return Math.floor(diff / Year) + ' ' + LOCALE[locale].y;
}

export function formatTime(timestamp, format) {
    if(timestamp === undefined && format === undefined) timestamp = Date.now();
    if(format === undefined && typeof timestamp === 'string' && timestamp !== '' && isNaN(timestamp)) {
        format = timestamp;
        timestamp = Date.now();
    }
    let od = new Date(Number(timestamp));
    if(isNaN(od.getTime())) throw new Error('Invalid Date');
    let y = od.getFullYear().toString(),
        M = od.getMonth() + 1,
        d = od.getDate(),
        H = od.getHours(),
        m = od.getMinutes(),
        s = od.getSeconds();
    let o = {
        yyyy: y,
        yyy: y.substr(1),
        yy: y.substr(2),
        y: y.substr(3),
        MM: M < 10 ? '0' + M : M,
        M: M,
        dd: d < 10 ? '0' + d : d,
        d: d,
        HH: H < 10 ? '0' + H : H,
        H: H,
        mm: m < 10 ? '0' + m : m,
        m: m,
        ss: s < 10 ? '0' + s : s,
        s: s,
    };
    if(!format || typeof format !== 'string') format = 'yyyy-MM-dd HH:mm:ss';
    return format.replace(/y{1,4}|M{1,2}|d{1,2}|H{1,2}|m{1,2}|s{1,2}/g, a => o[a]);
}

export function rem2px(v) {
    return parseInt(window.getComputedStyle(document.documentElement).fontSize) * v;
}

export function copy(txt) {
    return new Promise((resolve, reject) => {
        var dom = document.createElement('fake');
        var selection = window.getSelection();
        var range = document.createRange();
        var err = 0;
        dom.innerText = txt;
        document.body.appendChild(dom);
        selection.removeAllRanges();
        range.selectNode(dom);
        selection.addRange(range);
        try {
            document.execCommand('copy');
        } catch(e) {
            err = 1;
        }
        dom.remove();
        err ? reject() : resolve();
    });
}

export function sliceAddress(a, start, end) {
    return a.substr(0, start) + '...' + a.substr(-end);
}

export function checkURL(v) {
    return /^https?:\/\/.+/i.test(v);
}
const replyCommentReg = /^@(0x)?[0-9a-f]{64}[:]{1}/
const nftCodeReg = /^(0x)?[0-9a-f]{64}/

export function contentForamt(content, onHoverHandle) {
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/https?:\/\/[^\r\n]+/ig, a => `<a href="${a}" target="_blank" rel="noopener">${a}</a>`).replace(/[\r\n]/g, '<br/>').replace(replyCommentReg, replyStr => `<a href={"${window.location.host}/u/${getNftCode(replyStr)}"} onMouseEnter="for(var i=0;i<10;  console.log(123) || i++ ){}" target="_self" rel="noopener" class="comment-at">${replyStr.substring(0, replyStr.length - 1)}</a>:`);
}

// export function contentFormat

export function arrayToTree(arr, pid='pid', id = 'id') {
    let map = {}, root = [];
    arr.forEach(d => {
        map[d[id]] = d;
    });
    arr.forEach(d => {
       if(map[d[pid]]) {
           if(!map[d[pid]].children) map[d[pid]].children = [];
           map[d[pid]].children.push(d);
       } else {
           root.push(d);
       }
    });
    return root[0];
}

export function isReplyComment(str){
    return replyCommentReg.test(str)
}

export function getNftCode(replyComment){
    if(!isReplyComment(replyComment)) return
    return replyComment.substring(1,67)
}

export function shortNftCode(nftCode){
    if(!nftCodeReg.test(nftCode)) return 
    return nftCode.substring(0,4) + '...' +nftCode.substring(nftCode.length - 4, nftCode.length)
}