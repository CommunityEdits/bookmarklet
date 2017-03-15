import { IPageInfo } from './page';
import { notice, CENoticeComponent, CEIOComponent } from '../components';
import { hasClass } from './page';
import { log } from '../services';
import { me, page } from '../models';


/**
 * Add all necessary components to display proposals and accept input.
 * Basically shows Community Edits is working on the web page.
 */
export function inject(info: IPageInfo) {

    // Inject CE's basic framework
    notice.place(info.target);
    log.debug("Notice injected", page.notice);
    page.io_coms = injectIOComponents(info);
    log.debug(page.io_coms.length, "IO Components injected", page.io_coms);

    // When the display elements are ready, add proposals.
    page.display();
}


/** 
 * Since I need to be able to click text nodes and reference them again to add edits,
 * we just translate them into p elements here...
 */
function fix_text_nodes(target: Element) {
    console.log("fixing", target);
    for (let i = 0; i < target.childNodes.length; i++) {
        if (target.childNodes[i].nodeName == "#text") {
            let rep = String(target.childNodes[i]['data']).trim();
            if (rep) {
                let ff = document.createElement("p");
                ff.textContent = rep;
                target.replaceChild(ff, target.childNodes[i]);
            }
        }
    }
}


/**
 * Save the state of the page for reference.
 */
function get_snapshot(target: Element) {
    let snapshot = [];

    // Count the number of #text nodes there are...
    let count = 0;
    for (let c of <any>target.childNodes) {
        if (c.nodeName == "#text") {
            if (String(c.data).trim()) {
                count += 1;
            }
        }
    }

    // If we find more than 10, assume the page is just bad and fix it.
    log.debug("Snapshot #text found:", count);
    if (count > 10) {
        log.debug("Attempting element fixes.");
        fix_text_nodes(target);
    }

    for (let c of <any>target.childNodes) {
        // Just skip these.
        if (c.nodeName == "#comment" || hasClass(c, "sharedaddy")) {
            continue;
        }
        if (c.nodeName != '#text') {
            snapshot.push(c);
        }
    }

    return snapshot;
}

function injectIOComponents(info: IPageInfo) {
    // Take a snapshot of the page state and fix as necessary.
    let snapshot = get_snapshot(info.target);
    let io_coms: CEIOComponent[] = [];

    // With the copy, now I can make targets clickable and create their io_divs.
    let node_index = 0;
    for (let child of snapshot) {
        // Prepare all the child nodes with io_divs.
        let iod = new CEIOComponent();
        iod.target = child;
        iod.index = node_index;
        child.addEventListener("click", iod.toggle.bind(iod));
        io_coms.push(iod);
        node_index += 1;

        child.parentNode.insertBefore(iod, child.nextSibling);
    }

    return io_coms;
}