import { Tabs } from './tabs';
import { hasClass } from '../tools/page';
import { Proposal } from '../models/proposal';
import { me } from '../models';
import { log } from '../services';


export class CEIOComponent extends HTMLElement {
    tabs: Tabs;
    unopened: boolean = true;
    proposed_edits: Proposal[] = [];

    edits_page: any;
    proposals_div: any;
    text_area: any;
    status: any;
    original: any;
    index: any;
    target: any;
    constructor() {
        super()
        const shadowRoot = (<any>this).attachShadow({ mode: 'open' });

        this.set_style();

        this.setup_tabs();
        shadowRoot.appendChild(this.tabs.nav_bar);
        shadowRoot.appendChild(this.tabs.page_area);
    }

    set_style() {
        let style = `
        .ce-navbar {
            list-style-type:none;
            padding:0;
            margin:0;
            overflow:hidden;
            border:1px solid #ccc;
            background-color:#f1f1f1
        }
        .ce-tab {
            float:left
        }
        .ce-tab>a {
            width:auto;
            display:inline-block;
            color:black;
            text-align:center;
            padding:1rem;
            text-decoration:none;
            transition:0.3s;
            font-size:17px;
            background-color:#f1f1f1
        }
        .ce-tab-page {
            padding:1rem;
            border:1px solid #ccc;
            border-top:none;
            background:#f1f1f1
        }

        .ce-statslist {
            margin:0;
            padding:1rem;
            overflow:hidden;
            list-style-type:none;
            background-color:#f1f1f1;
            border:1px solid #ccc
        }
        .ce-statslist>li {
            float:left;
            display:inline-block;
            color:black;
            text-align:center;
            padding:.5rem 1rem;
        }

        .ce-submission>textarea {
            display:block;
            width:100%;
            overflow:hidden;
            resize:none
        }
        .ce-submission>button {
            margin:1rem 1rem 0 0
        }
        .ce-proposals {
            background:white
        }
        .ce-commenting>textarea {
            display:block;
            width:100%;
            overflow:hidden;
            resize:none
        }
        .ce-commenting>button {
            margin:1rem 1rem 0 0
        }

        .ce-proposal{
            padding:1rem;
            border:1px solid #ccc
        }
        .ce-edit>hr{
            padding:0;
            margin:1rem;
            border:1px solid #ccc
        }

        .ce-messages{
            overflow-y:auto;
            min-height:5rem;
            max-height:23rem
        }        
        .ce-message-heading{
            background:white
        }
        .ce-message-body{
            background:white;
            margin:0
        }`;
        let internal_style = document.createElement("style");
        internal_style.innerHTML = style;
        this.shadowRoot.appendChild(internal_style);
    };

    setup_tabs() {
        this.tabs = new Tabs(["Edit"]);

        // Register the edits tab.
        this.edits_page = this.tabs.pages[0];

        // Known proposals div.
        this.proposals_div = document.createElement("div");
        this.edits_page.appendChild(this.proposals_div);
        this.proposals_div.className = "ce-proposals";

        // User submission div.
        let submit_area = document.createElement("div");
        this.edits_page.appendChild(submit_area);
        submit_area.className = "ce-submission";

        // Submission label.
        let ta_label = document.createElement("label");
        ta_label.textContent = "Have your own proposal?";
        submit_area.appendChild(ta_label);

        // Submission user input, pre-seeded, auto-resizing.
        let text_area = document.createElement("textarea");
        this.text_area = text_area;
        let this_ceio = this;
        text_area.oninput = function (e) {
            let ta = <HTMLTextAreaElement>e.target;
            ta.style.height = "5px";
            ta.style.height = (ta.scrollHeight) + "px";
        };
        submit_area.appendChild(text_area);

        // Submission button.
        let submit_button = document.createElement("button");
        submit_button.onclick = this.submit_proposal.bind(this);
        submit_button.textContent = "SUBMIT";
        submit_area.appendChild(submit_button);

        // Drop a notice next to the submit button to let the user know I'm on it.
        this.status = document.createElement("span");
        submit_area.appendChild(this.status);
    };

    toggle() {
        if (this.unopened) {
            this.unopened = false;

            this.original = this.previousElementSibling.innerHTML;
            this.text_area.textContent = this.original;
        }

        // If we just toggled open, then steal the pages from where ever.
        if (this.tabs.nav_bar.style.display === "none") {
            this.tabs.steal_pages();
        }

        this.tabs.nav_bar.style.display = this.tabs.nav_bar.style.display === "none" ? "" : "none";
        this.tabs.page_area.style.display = this.tabs.page_area.style.display === "none" ? "" : "none";
        this.text_area.dispatchEvent(new Event("input"));
    };

    /**
     * Take the user's proposed change from the textarea and submit it.
     */
    submit_proposal() {
        this.status.textContent = "Submitting...";
        me.propose_edit(this.index, this.original, this.text_area.value)
            .then(r => {
                this.status.textContent = "Success.";
                log.info("Proposal submitted", r);
            }).catch(r => {
                this.status.textContent = `Failed. ${r}`;
                log.warn("Proposal submission failed.", r);
            });
    };

    /**
     * Given known proposals from the system, display them.
     */
    add_proposal(proposal: Proposal) {
        log.debug("adding proposal", proposal);
        this.proposed_edits.push(proposal);
        this.proposals_div.appendChild(proposal.element);

        // Highlight the element this IO div refers to if it hasn't already been.
        if (!hasClass(this.previousElementSibling, "ce-proposed")) {
            this.previousElementSibling.className += " ce-proposed";
            // Hack the style.
            let es = (<HTMLElement>this.previousElementSibling).style;
            es.borderLeft = "4px solid gold";
            es.marginLeft = "-4px";
        }
    };
}

interface CustomElements {
    define(elementName: string, element: any): void;
}


declare global {
    interface Window {
        customElements: CustomElements;
    }
}

try {
    window.customElements.define("ce-io", CEIOComponent)
} catch (error) {
    log.error(error);
}
