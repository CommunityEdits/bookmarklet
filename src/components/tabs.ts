import { log, g } from '../services';


/**
 * Model for in page navigation.
 */
export class Tabs {
    current_tab: number;
    nav_bar: HTMLElement;
    page_area: HTMLElement;

    // Line items holding the link elements of the tab.
    lis: HTMLLIElement[] = []
    // Link elements, for toggling which is active.
    links: HTMLAnchorElement[] = [];
    // A div corresponding to each nav element in the bar.
    pages: HTMLDivElement[] = [];

    /**
     * @param tab_info is just a list of strings we use to name each tab in the nav bar.
     */
    constructor(tab_info: string[]) {
        // Create the nav bar for the tabs to live.
        this.nav_bar = document.createElement("ul");
        this.nav_bar.className = "ce-navbar";

        this.init_tabs(tab_info);

        // Enable the first by default.
        this.set_active(this.lis[0], this.pages[0]);

        // Hide by default.
        this.nav_bar.style.display = "none";
        this.page_area.style.display = "none";
    }

    init_tabs(tab_info: string[]) {
        // Create one area to hold all the pages, in hiding, till nav click toggles.
        this.page_area = document.createElement("div");

        for (let i = 0; i < tab_info.length; i++) {
            this.add_tab(tab_info[i]);
        }
    }

    add_tab(name: string) {
        // Create the nav option in the nav bar.
        let tab_element = document.createElement("li");
        tab_element.className = "ce-tab";

        // Create the link with text in the nav option.
        let link = document.createElement("a");
        link.textContent = name;

        // Create the page whose contents are displayed on corresponding tab click.
        let page = document.createElement("div");
        page.className = "ce-tab-page";
        page.style.display = "none";

        // Model tracking.
        this.lis.push(tab_element);
        this.links.push(link);
        this.pages.push(page);

        // Placements.
        this.nav_bar.appendChild(tab_element);
        tab_element.appendChild(link);
        this.page_area.appendChild(page);

        // Create the click->toggle page behavior.
        link.addEventListener("click", this.set_active.bind(this, tab_element, page));
        this.page_area.addEventListener("stolen", this.stolen_from.bind(this), true);
    }

    /**
     * Adjusts active nav and page display accordingly.
     */
    set_active(link: HTMLLIElement, page: HTMLDivElement) {
        for (let i = 0; i < link.parentNode.childNodes.length; i++) {
            link.parentNode.childNodes[i].childNodes[0]["style"]["backgroundColor"] = (link.parentNode.childNodes[i] == link) ? "#ccc" : "";
            page.parentNode.childNodes[i]["style"]["display"] = (page.parentNode.childNodes[i] == page) ? "" : "none";
        }
    }

    /**
     * Grab that status/etc tabs and move them to the currently in use tab bar.
     */
    steal_pages() {
        g.steal.then(_ => {
            let old = g.stealPages[0].parentNode;

            for (let i = 0; i < 4; i++) {
                this.nav_bar.appendChild(g.stealLinks[i]);
                g.stealLinks[i].childNodes[0]['style'].background = "#f1f1f1";
                this.page_area.appendChild(g.stealPages[i]);
                g.stealPages[i].style.display = "none";
            }

            old.dispatchEvent(new Event("stolen"));
            this.set_active(this.lis[0], this.pages[0]);
        })
    }

    /**
     * If the status/etc tabs are stolen from this set, then default to the edit page.
     */
    stolen_from() {
        this.set_active(this.lis[0], this.pages[0]);
    }
}
