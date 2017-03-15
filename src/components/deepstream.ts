import { me, page } from '../models';
import { log, query } from '../services';
import { Message } from './message';


declare global {
    interface Window {
        deepstream(url: string, options?: any): deepstreamIO.Client;
    }
}


export class DeepStreamer {
    deepstreamScript: HTMLScriptElement;
    client: deepstreamIO.Client;
    channel: string;

    element: HTMLDivElement;

    // Allow one retry, then switch to false.
    retry = true;

    messages: Message[];
    messagesElement: HTMLDivElement;

    inputElement: HTMLInputElement;

    constructor() {
        window["ce"] = window["ce"] || {};
        window["ce"]["ds"] = this;
        log.debug("ds", this);

        this.deepstreamScript = document.createElement("script");
        this.deepstreamScript.src = "https://cdnjs.cloudflare.com/ajax/libs/deepstream.io-client-js/2.1.1/deepstream.js";
        this.deepstreamScript.onload = () => this.setup();

        document.head.appendChild(this.deepstreamScript);

        this.element = document.createElement("div");
        this.messagesElement = document.createElement("div");
        this.messagesElement.className = "ce-messages";
        this.element.appendChild(this.messagesElement);

        this.messages = [];

        me.p.then(m => {
            if (m.isAuthenticated) {
                this.enableInput();
            }
        });
    }

    enableInput() {
        this.inputElement = document.createElement("input");
        this.inputElement.style.width = "100%";
        this.element.appendChild(this.inputElement);
        this.inputElement.onkeyup = e => {
            if (e.keyCode === 13) {
                this.client.rpc.make(
                    this.channel,
                    {
                        evt: "msg",
                        author: {
                            id: me.id,
                            username: me.username
                        },
                        source: this.inputElement.value
                    },
                    (err: any, status: any) => {
                        log.info("Chat rpc", err, status);
                    });

                this.inputElement.value = "";
            }
        };
    }

    getProposal(targetID: string) {
        let q = `
        query {
            proposal(id:"${targetID}") {
                id
                dateCreated
                author {
                    id
                    username
                }
                versionHash
                index
                original
                proposed
                status
                merit
                sin
                comments {
                    id
                    author {
                        id
                        username
                    }
                    source
                    dateCreated
                }
            }
        }`;
        return query(q);
    }

    setup() {
        this.client = window.deepstream("wss://communityedits.com:6020").login();

        page.p.then(p => {
            let site = p.status.context.id;
            this.channel = `site/${site}`;
            this.client.event.subscribe(this.channel, (data: any) => {
                log.debug("Deepstream to", data);
                if (data.evt == "msg") {
                    this.addMessage(data);
                } else if (data.evt == "ec") {
                    this.getProposal(data.target).then((rv: any) => {
                        let p: IProposal = rv.proposal;
                        page.updateWithProposal(p);
                    }).catch((reason: string) => {
                        log.error("Deepstream update", reason);
                        throw reason;
                    })
                }
            });

            this.getHistory();
        })
    }

    getHistory() {
        this.client.rpc.make(this.channel, {}, (err: string, rv: any[]) => {
            if (err) {
                log.error("deepstream", err);

                if (this.retry) {
                    log.info("chat retry 1 more time.");
                    this.retry = false;
                    this.getHistory();
                }
            } else {
                log.info("chat history", rv);

                rv.map(data => this.addMessage(data));
            }
        })
    }

    addMessage(data: any) {
        let scrollWith = false;

        let top = this.messagesElement.scrollTop;
        let size = this.messagesElement.clientHeight;
        let length = this.messagesElement.scrollHeight;

        if ((top + size) == length) {
            scrollWith = true;
        }

        let m = new Message(data);
        this.messagesElement.appendChild(m.element);
        this.messages.push(m);

        if (scrollWith) {
            this.messagesElement.scrollTop = length;
        }
    }

    scrollToBot() {
        this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    }
}