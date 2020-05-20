class iRem {
    constructor() {

    }
    static install(doc) {
        var docEl = doc.documentElement,
            // resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            isPad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
        // function recalc() {
        //     console.log(isPad, 'isPad')
        //     var clientWidth = docEl.clientWidth;
        //     if (!clientWidth) return;
        //     isPad ? docEl.style.fontSize = 100 * (clientWidth / 768) + 'px' : docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
        // };
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        isPad ? docEl.style.fontSize = 100 * (clientWidth / 768) + 'px' : docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
        // if (!doc.addEventListener) return;
        // win.addEventListener(resizeEvt, recalc, false);
        // doc.addEventListener('DOMContentLoaded', recalc, false);
    }
}
export default iRem;