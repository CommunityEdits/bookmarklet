/**
 * A script to help load the main Community Edits script by building a button.
 */
/**
 * Call the Community Edits script to process the element on the page specified by selector.
 * @param {*} selector
 */
function loadCEScript(selector) {
    var s = document.createElement('script');
    s.src = 'https://communityedits.com/scripts/bookmarklet/app.min.js';
    document.body.appendChild(s);
    s.onload = function () {
        window.ce.processPage(selector);
    };
}
/**
 * Build and style a button that a user can click if they want to run the Community Edits script.
 *
 * I wrote in some options that I felt might be useful.
 * - noStyle if the user wants to style it to match their own website better.
 * - onScrollUp if the user wants the button to only show when first called, at the very bottom, and otherwise only when scrolling up.
 * - noAppend if the user wants to just have the link returned without insertion into the dom so they can do their own thing with it.
 * @param {*} options
 */
function makeCEButton(options) {
    if (options === void 0) { options = {}; }
    var t = document.createElement("a");
    t.className = "ce-loader-button";
    t.textContent = options.label || "Community Edits";
    // Include styling if they don't specify their own.
    if (!options.noStyle) {
        var s_opts = {
            background: "none",
            margin: "0",
            position: "fixed",
            bottom: "0",
            left: "0",
            zIndex: "100",
            textDecoration: "none",
            color: "#ffffff",
            backgroundColor: "#444444"
        };
        for (var opt in s_opts) {
            t.style[opt] = s_opts[opt];
        }
    }
    var pointerFunc;
    // t.href = "javascript:loadCEScript();"
    t.onclick = function () {
        window.removeEventListener("scroll", pointerFunc);
        loadCEScript(options.selector);
        t.style.display = "none";
    };
    // Detect scrolling.
    if (options.onScrollUp) {
        // Except always show if it's at the bottom.
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
            t.style.display = "";
        }
        var lastPosition_1 = window.pageYOffset;
        function showOnScrollUp() {
            if (lastPosition_1 > window.pageYOffset) {
                if (t.style.display == "none") {
                    t.style.display = "";
                }
            }
            if (lastPosition_1 < window.pageYOffset) {
                if (t.style.display == "") {
                    t.style.display = "none";
                }
            }
            lastPosition_1 = window.pageYOffset;
            // Except always show if it's at the bottom.
            if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
                t.style.display = "";
            }
        }
        pointerFunc = showOnScrollUp;
        window.addEventListener("scroll", pointerFunc);
    }
    if (!options.noAppend) {
        document.body.appendChild(t);
    }
    else {
        return t;
    }
}
/**
 * This is basically what happens when the bookmarklet gets clicked.
 */
function test() {
    var s = document.createElement("script");
    s.src = "https://communityedits.com/scripts/loader.js";
    s.onload = function () {
        makeCEButton({
            onScrollUp: true
        });
    };
    document.head.appendChild(s);
    //javascript:(function (){let s = document.createElement("script");s.src = "https://communityedits.com/loader.js";s.onload = () => {makeCEButton({onScrollUp: true})};document.head.appendChild(s);})();
}
