import { hash } from './sha1';

export interface IPageInfo {
    selector: string;
    hash: string;
    target: Element;
}

/**
 * Collects selector and hash data from page using best guesses.
 * @ return {selector, hash, element} / {}
 */
export function get_page_info(selector: string): IPageInfo | void {
    let element;
    let targets = [
        "div[itemprop='articleBody']",
        ".entry-content",
        "#content",
        ".entry",
        ".post-entry",
        ".post-content",
        ".blog-content",
        ".storytext",
        ".storycontent",
        ".CommonWhiteTypeOne",
        ".articleText"
    ];
    // Check the selector we're given.
    if (selector) {
        element = document.querySelector(selector);
        if (!element) {
            return;
        }
    }
    // Otherwise, check some known ones.
    if (!selector) {
        for (let t of targets) {
            element = document.querySelector(t);
            if (element) {
                selector = t;
                break;
            }
        }
        if (!element) {
            return;
        }
    }

    let node_json: HTMLElement = html_to_json(element);
    let node_hash: string = hash(JSON.stringify(node_json));

    let rv = {
        "selector": selector,
        "hash": node_hash,
        "target": element
    }
    return rv
}

export function hasClass(target: Element, className: string) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

//http://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
export var cssPath = function (el: Element) {
    if (!(el instanceof Element))
        return;
    var path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
            path.unshift(selector);
            break;
        } else {
            var sib = el, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() == selector)
                    nth++;
            }
            if (nth != 1)
                selector += ":nth-of-type(" + nth + ")";
        }
        path.unshift(selector);
        el = el.parentElement;
    }
    return path.join(" > ");
}



export let class_ignores = ["sharedaddy", "code-block"];
/**
 * Converts an HTML node into JSON.
 * 
 * Kind of. Drops certain nodes that might be problematic.
 */
export function html_to_json(node: any): any {
    if (node.nodeName === "#text") {
        return {
            "nodeName": "#text",
            "textContent": node.textContent
        }
    }
    if (node.nodeName == "#comment") {
        return { is_empty: true }
    }
    // Ignores.
    for (let i = 0; i < node.classList.length; i++) {
        if (class_ignores.indexOf(node.classList[i]) > -1) {
            return { is_empty: true };
        }
    }
    // if (node.getAttribute("itemtype") === "http://schema.org/Article") {
    //     return { is_empty: true };
    // }

    let ret_obj = {
        "nodeName": node.nodeName
    }

    if (node.classList.length) {
        let actual_list = [];
        for (let cl of node.classList) {
            actual_list.push(cl);
        }
        ret_obj["classes"] = actual_list;
    }

    let cns = []
    for (let cn of node.childNodes) {
        let result: any = html_to_json(cn);
        if (!result.is_empty) {
            cns.push(result);
        }
    }
    if (cns.length) {
        ret_obj["childNodes"] = cns;
    }
    return ret_obj;
}