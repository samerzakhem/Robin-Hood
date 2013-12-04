/**
 * inhibit the user from scrolling the QNXStageWebView
 * @author Gareth Williams
 */

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    window.scroll(0,0);
    return false;
}, false);