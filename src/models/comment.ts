import { timeSinceElement } from '../tools/formatting';
import { me } from '../models';
import { log } from '../services';


export class Comment implements IComment {
    id: string;
    author: IAuthor;
    source: string;
    dateCreated: number;

    element: HTMLDivElement;

    constructor(data: IComment) {
        this.id = data.id;
        this.author = data.author;
        this.source = data.source;
        this.dateCreated = data.dateCreated;

        this.element = document.createElement("div");
        this.element.className = "ce-comment";

        this.displayAuthor();
        this.displayText();
    }

    displayAuthor() {
        let author = document.createElement("span");
        this.element.appendChild(author);
        author.className = "ce-edit-submenu-label";
        author.textContent = `${this.author.username}`;

        let time = timeSinceElement(this.dateCreated * 1000);
        time.style.cssFloat = "right";
        this.element.appendChild(time);
        time.className = "ce-edit-submenu-label";
    }

    displayText() {
        let text = document.createElement("div");
        text.textContent = this.source;
        this.element.appendChild(text);
    }

    insertBefore(target: HTMLElement) {
        target.parentElement.insertBefore(this.element, target);
    }
}


export class CommentsSection {
    proposal: IProposal;
    comments: Comment[] = [];

    element: HTMLDivElement;
    // element[HR, comment*, inputDiv[textArea statusSpan]]

    toggleButton: HTMLSpanElement;

    textArea: HTMLTextAreaElement;
    inputDiv: HTMLDivElement;
    statusSpan: HTMLSpanElement;

    constructor(proposal: IProposal) {
        this.proposal = proposal;

        this.element = document.createElement("div");
        this.element.className = "ce-comments-section";
        // Hide by default.
        this.element.style.display = "none";

        // Separate the comments from the stuff before it.
        this.element.appendChild(document.createElement("hr"));

        this.makeToggleButton();
        this.makeInputDiv();
        this.processComments();
    }

    makeToggleButton() {
        let tb = document.createElement("span");
        this.toggleButton = tb;
        tb.textContent = `Comment? (${this.proposal.comments.length})`;
        tb.onclick = _ => {
            let flip = this.element.style.display == "none" ? "" : "none";
            this.element.style.display = flip;
            this.textArea.dispatchEvent(new Event("input"));
        }
        tb.style.display = "inline-block";
        tb.style.cssFloat = "right";
        tb.onmouseenter = _ => tb.style.textDecoration = "underline";
        tb.onmouseout = _ => tb.style.textDecoration = "none";
    }

    makeInputDiv() {
        this.inputDiv = document.createElement("div");
        this.inputDiv.className = "ce-commenting";
        this.element.appendChild(this.inputDiv);

        let ta = document.createElement("textarea");
        this.textArea = ta;
        this.inputDiv.appendChild(ta);
        this.textArea.oninput = _ => {
            ta.style.height = "5px";
            ta.style.height = ta.scrollHeight + "px";
        }

        let submit = document.createElement("button");
        this.inputDiv.appendChild(submit);
        submit.textContent = "POST";
        submit.onclick = _ => {
            this.statusSpan.textContent = "Posting...";
            me.post_comment(this.proposal.id, this.textArea.value).then(_ => {
                this.statusSpan.textContent = "Success.";
                log.info("Post success.");
            }).catch(reason => {
                this.statusSpan.textContent = `Failed. ${reason}`;
                log.warn("Post failed", reason);
            });
        }

        this.statusSpan = document.createElement("span");
        this.inputDiv.appendChild(this.statusSpan);
    }

    processComments() {
        for (let i = 0; i < this.proposal.comments.length; i++) {
            let c = new Comment(this.proposal.comments[i]);
            this.comments.push(c);

            if (i > 0) {
                let halfSep = document.createElement("hr");
                halfSep.style.width = "50%";
                this.inputDiv.parentElement.insertBefore(halfSep, this.inputDiv);
            }
            c.insertBefore(this.inputDiv);
        }
    }

    updateComments(allComments: any[]) {
        // Avoid re-adding existing comments.
        let old = this.comments.map(c => c.id);
        let newComments = allComments.filter(i => old.indexOf(i.id) == -1);

        // Place separator as necessary.
        if (old.length) {
            let h = document.createElement("hr");
            h.style.width = "50%";
            this.inputDiv.parentElement.insertBefore(h, this.inputDiv);
        }

        let i = 0;
        for (let nc of newComments) {
            let c = new Comment(nc);
            this.comments.push(c);

            if (i > 0) {
                let halfSep = document.createElement("hr");
                halfSep.style.width = "50%";
                this.inputDiv.parentElement.insertBefore(halfSep, this.inputDiv);
            }
            c.insertBefore(this.inputDiv);
            i = i + 1;
        }
    }
}
