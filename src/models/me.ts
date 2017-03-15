import { query, log } from '../services';
import { page } from './page';


class Me implements IMe {
    id: string;
    username: string;

    p: Promise<Me>;
    private readyResolve: any;


    constructor() {
        window["ce"] = window["ce"] || {};
        window["ce"]["me"] = this;
        log.debug("me", this);

        // Create the promise now, but only resolve after initialization.
        this.p = new Promise(resolve => this.readyResolve = resolve);
    }

    /**
     * Initilization should be delayed till there is reasonable confidence
     * that the page can be processed.
     */
    init() {
        log.debug("me initilization");
        this.ping().then(({ping}: any) => {
            if (!ping.user) {
                throw Error("Not signed in.")
            }
            this.id = ping.user.id;
            this.username = ping.user.username;

            log.info("me ready", ping);
            // Signal readiness.
            this.readyResolve(this);
        });
    }

    ping() {
        let q = `
        mutation {
            ping (
                status:"Last seen reading ${document.title}"
            ) {
                user {
                    id
                    username
                }
                notifications
            }
        }`;
        return query(q);
    }

    get isAuthenticated() {
        if (this.id) {
            return true;
        } else {
            return false;
        }
    }

    propose_edit(index: number, original: string, proposal: string) {
        let q = `
        mutation {
            propose (
                context:"${page.page_id}"
                hash:"${page.info.hash}"
                original:${JSON.stringify(original)}
                proposal:${JSON.stringify(proposal)}
                index:${index}
            ) {
                edit {
                    id
                }
            }
        }`;

        return new Promise((resolve, reject) => {
            let c1 = !page.page_id;
            let c2 = !this.isAuthenticated;
            let c3 = original == proposal;

            if (c1) {
                reject("Page id not ready.");
            }
            if (c2) {
                reject("User not logged in.");
            }
            if (c3) {
                reject("Proposal is not different.");
            }

            if (!(c1 || c2 || c3)) {
                query(q).then((r: any) => resolve(r)).catch((r: string) => reject(r));
            }
        });
    }

    post_comment(context: string, comment: string) {
        let q = `
        mutation {
            post (
                context:"${context}"
                source:${JSON.stringify(comment)}
            ) {
                post {
                    id
                }
            }
        }`;

        return new Promise((resolve, reject) => {
            if (!comment) {
                return reject("No comment text.");
            }
            if (!this.isAuthenticated) {
                return reject("User not logged in.");
            }

            query(q).then((r: any) => resolve(r));
        });
    }
}


export var me = new Me();
