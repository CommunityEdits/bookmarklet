import { log } from './services';
import { get_page_info } from './tools/page';
import { inject } from './tools/inject';
import { me, page } from './models';


log.debug("Script loaded");


function processPage(selector?: string) {
    log.debug("process_page");
    // Reject attempts to rerun the script on the page.
    if (document.querySelector("ce-notice")) {
        log.info("Skipping rerun.");
        return;
    }

    // Search for the provided selector, or use some best guesses.
    let info = get_page_info(selector);

    // If no selector can be found, abort.
    if (!info) {
        log.error("Could not find an appropriate target.");
        return;
    }

    // Get the latest page info and user data - async.
    page.init(info);
    me.init();

    /**
     * Inject basic display elements.
     * - Add page status and notifications to the top.
     * - Make text clickable -> brings up proposal area.
     */
    inject(info);
}

window["ce"] = window["ce"] || {};
window["ce"]["processPage"] = processPage;


log.debug("Script finished");
