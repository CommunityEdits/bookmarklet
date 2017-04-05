import { get_status } from '../services/page';
import { Proposal } from './proposal';
import { IPageInfo } from '../tools/page';
import { CEIOComponent, CENoticeComponent, notice } from '../components';
import { log } from '../services';


class Page {
    // Basic information gathered about page.
    info: IPageInfo;

    // Raw status data.
    status: any;
    page_id: string;

    // The JSON data for all edits on page.
    // raw_edits: IProposal[];

    // The models generated for each proposed edit.
    proposals: Proposal[] = [];

    notice: CENoticeComponent;
    io_coms: CEIOComponent[];

    p: Promise<Page>;
    private readyResolve: any;

    constructor() {
        window["ce"] = window["ce"] || {};
        window["ce"]["page"] = this;
        log.debug("page", this);

        // Resolve after initialization.
        this.p = new Promise(resolve => this.readyResolve = resolve);
    }

    init(info: IPageInfo) {
        log.debug("Page init", this);

        this.info = info;

        get_status(info).then(({ status }: any) => {
            this.status = status;

            this.page_id = status.id;

            this.update_notice(status);

            // Create new proposal models. Attachment happens elsewhere.
            this.ready_proposals(status);

            log.info("page ready", status);
            // Signal readiness.
            this.readyResolve(this);
        }).catch(reason => {
            notice.add_status(`Status error: ${reason}`);
            throw reason;
        });
    }

    /**
     * Display stats about the page in the notice area.
     */
    update_notice(status: any) {
        log.debug("Notice status ->", status);
        notice.add_status(`${status.proposals.length} proposals found.`);

        let c_array = status.proposals.map(({ comments }: any) => comments);
        let comments = [].concat(...c_array);
        notice.add_status(`${comments.length} comments found.`);
    }



    /**
     * Display any found proposals.
     * When called, waits till data is ready and displays.
     */
    display() {
        this.p.then(_ => {
            this.proposals.map(prop => prop.attach(this.io_coms));
        })
    }

    ready_proposals(status: any) {
        status.proposals.map((prop: any) => {
            this.proposals.push(new Proposal(prop));
        });
    }

    updateWithProposal(p: IProposal) {
        this.p.then(_ => {
            // Update existing if present, else add new.
            let existing = this.proposals.find(x => x.id == p.id);
            if (existing) {
                existing.commentsSection.updateComments(p.comments);
            } else {
                let newP = new Proposal(p);
                this.proposals.push(newP);
                newP.attach(this.io_coms);
            }
        })
    }
}


export var page: Page = new Page();
