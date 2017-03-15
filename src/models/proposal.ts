import { timeSince } from '../tools/formatting';
import { log, differ } from '../services';
import { CommentsSection } from './comment';
import { KarmaSection } from './karma';


export class Proposal implements IProposal {
    data: IProposal;

    id: string;
    index: number;
    dateCreated: number;
    author: IAuthor;
    versionHash: string;
    original: string;
    proposed: string;
    status: number;
    merit: number;
    sin: number;
    comments: IComment[] = [];

    // The view for this edit.
    element: HTMLDivElement;
    // element[core[prop,diff], menu[author,button,button], karma[], comments[]]

    // Display elements.
    prop_display: HTMLDivElement;
    diff_display: HTMLDivElement;

    coreSection: CoreSection;
    karmaSection: KarmaSection;
    commentsSection: CommentsSection;

    constructor(data: IProposal) {
        this.data = data;

        this.id = data.id;
        this.index = data.index;
        this.dateCreated = data.dateCreated;
        this.author = data.author;
        this.versionHash = data.versionHash;
        this.original = data.original;
        this.proposed = data.proposed;
        this.status = data.status;
        this.merit = data.merit;
        this.sin = data.sin;

        this.comments = data.comments;

        // Construct the view.
        this.element = document.createElement("div");
        this.element.className = "ce-proposal";
        this.construct_view();

        log.info("proposal", this);
    }

    construct_view() {
        this.coreSection = new CoreSection(this);
        this.element.appendChild(this.coreSection.element);
        this.element.appendChild(document.createElement("hr"));

        // Append a submenu
        let submenu_div = document.createElement("div");
        this.element.appendChild(submenu_div);

        // On that menu tell us a bit about the proposal.
        let label = document.createElement("span");
        submenu_div.appendChild(label);
        // label.className = "ce-edit-submenu-label";
        label.innerHTML = `Proposed by ${this.author.username} <span title='${new Date(this.dateCreated * 1000)}'>${timeSince(this.dateCreated * 1000)} ago</span>`;
        label.style.display = "block";


        let status = document.createElement("span");
        status.textContent = `Status: [${this.getStatusStatement(this.status)}]`;

        this.karmaSection = new KarmaSection(this);
        this.element.appendChild(this.karmaSection.element);

        this.commentsSection = new CommentsSection(this);
        this.element.appendChild(this.commentsSection.element);

        let buttonDiv = document.createElement("div");
        submenu_div.appendChild(buttonDiv);
        buttonDiv.style.textAlign = "center";
        buttonDiv.appendChild(this.karmaSection.toggleButton)
        buttonDiv.appendChild(status);
        buttonDiv.appendChild(this.commentsSection.toggleButton);
    }

    getStatusStatement(status: number) {
        let statement;
        if (status == 0) {
            statement = "Active";
        }
        if (status & 1) {
            statement = "Accepted";
        }
        if (status & 2) {
            statement = "Rejected";
        }
        if (status == 4) {
            statement = "Resolved";
        }
        if (status & 4 && status != 4) {
            statement += "+Resolved";
        }
        if (status & 8) {
            statement = "Deleted";
        }

        return statement;
    }


    /**
     * Find best place to attach and attach.
     * This is called later, once we know the page is ready.
     */
    attach(io_coms: IIOComponent[]) {
        if (this.index < io_coms.length) {
            io_coms[this.index].add_proposal(this);
        } else {
            // Throw any we can't match at the end.
            io_coms[io_coms.length - 1].add_proposal(this);
        }
    }
}


class CoreSection {
    proposal: IProposal;

    original: string = "";
    proposed: string = "";
    diff: string[];

    element: HTMLDivElement;

    constructor(proposal: IProposal) {
        this.proposal = proposal;
        this.original = proposal.original;
        this.proposed = proposal.proposed;

        this.element = document.createElement("div");
        this.element.className = "ce-proposal-core";

        this.buildViews();
    }

    buildViews() {
        let propDiv = document.createElement("div");
        let diffDiv = document.createElement("div");
        this.element.appendChild(propDiv);
        this.element.appendChild(diffDiv);
        propDiv.textContent = this.proposed;
        propDiv.style.display = "none";
        this.buildDiffDiv(diffDiv);
        propDiv.onclick = _ => {
            propDiv.style.display = propDiv.style.display == "none" ? "" : "none";
            diffDiv.style.display = diffDiv.style.display == "none" ? "" : "none";
        }
        diffDiv.onclick = _ => {
            propDiv.style.display = propDiv.style.display == "none" ? "" : "none";
            diffDiv.style.display = diffDiv.style.display == "none" ? "" : "none";
        }
    }

    buildDiffDiv(target: HTMLElement) {
        differ.diffChar(this.original, this.proposed).then(diff => {
            let fragment = document.createDocumentFragment();
            diff.forEach(part => {
                // green for additions, red for deletions
                // grey for common parts
                let color = part.added ? 'green' : part.removed ? 'red' : '';
                let span = document.createElement('span');
                span.style.background = color;
                span.style.color = (color == "green")? "white": "black";
                span.appendChild(document.createTextNode(part.value));
                fragment.appendChild(span);
            });
            target.appendChild(fragment);
        });
    }

    /**
     * For marking changes to the text.
     */
    add_fragment(node: any, text: string, color: string, category: string) {
        let ns = document.createElement("span");
        if (category) {
            ns.className = category == "+" ? "ce-addition" : "ce-subtration";
        }
        ns.style.background = color;
        ns.textContent = text;
        node.appendChild(ns);
    }
}
