import { Tabs } from './tabs';
import { me, page } from '../models';
import { DeepStreamer } from './deepstream';
import { g } from '../services';
import { log } from '../services';


declare global {
    interface HTMLElement {
        attachShadow(shadowRootInit: any): ShadowRoot;
    }
}


export class CENoticeComponent extends HTMLElement {
    tabs: Tabs;
    stats_list: any;
    shadowRoot: ShadowRoot;

    deepstream: DeepStreamer;


    constructor() {
        super();

        window["ce"] = window["ce"] || {};
        window["ce"]["notice"] = this;
        log.debug("notice", this);

        const shadowRoot = this.attachShadow({ mode: 'open' });

        this.set_style();

        // Create the notice.
        let notice_area = document.createElement("div");
        notice_area.setAttribute("id", "ce-notice");
        let mn_title = document.createElement("h2");
        mn_title.textContent = "Community Edits Script Running";
        notice_area.appendChild(mn_title);
        shadowRoot.appendChild(notice_area);

        this.tabs = new Tabs(["Status", "Echoes", "Etc", "Not signed in"]);
        shadowRoot.appendChild(this.tabs.nav_bar);
        shadowRoot.appendChild(this.tabs.page_area);

        // Get these tabs ready to be stolen.
        g.stealLinks = this.tabs.lis;
        g.stealPages = this.tabs.pages;
        g.stealResolve();

        // Make sure they're not hidden by default.
        this.tabs.nav_bar.style.display = "";
        this.tabs.page_area.style.display = "";

        this.makeStatusDiv();
        this.makeChatDiv();
        this.makeLinksDiv();
        this.makeUserDiv();
    };

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

    makeStatusDiv() {
        let tabPage = this.tabs.pages[0];
        tabPage.style.padding = "0";
        tabPage.style.border = "none";

        let na_list = document.createElement("ul");
        this.stats_list = na_list;
        na_list.className = "ce-statslist";
        tabPage.appendChild(na_list);
    }

    makeChatDiv() {
        // this.tabs.pages[1].innerHTML = `<p style="text-align: center;">Not yet implemented</p>`;
        this.deepstream = new DeepStreamer();
        this.tabs.pages[1].appendChild(this.deepstream.element);
        this.tabs.links[1].onclick = () => {
            this.deepstream.scrollToBot();
        };
    }

    makeLinksDiv() {
        // https://mathiasbynens.github.io/rel-noopener/
        this.tabs.pages[2].innerHTML = `
        <a rel="noopener" href="https://communityedits.com/s/${location.host}" target="_blank">Site page on Community Edits</a>
        `;
    }

    makeUserDiv() {
        // Pull to right.
        let user_nav = this.tabs.lis[3];
        (<HTMLElement>user_nav).style.cssFloat = "right";

        me.p.then(user => {
            this.tabs.links[3].textContent = `${user.username}`;
            this.tabs.pages[3].innerHTML = `<p>You are logged in as ${user.username}.</p>`;
        })
    }

    add_status(status: string) {
        let li = document.createElement("li");
        li.textContent = status;
        this.stats_list.appendChild(li);
    }

    place(target: Element) {
        target.parentNode.insertBefore(this, target);
    }
}

// If you don't register it, then it complains about illegal constructor.
// It complains regardless on firefox though.
try {
    window.customElements.define("ce-notice", CENoticeComponent);
} catch (error) {
    log.error(error);
}

export var notice: CENoticeComponent = new CENoticeComponent();