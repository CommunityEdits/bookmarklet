export class KarmaSection {
    proposal: IProposal;

    element: HTMLDivElement;
    // element[HR, span]

    toggleButton: HTMLSpanElement;

    constructor(proposal: IProposal) {
        this.proposal = proposal;

        this.element = document.createElement("div");
        this.element.style.display = "none";
        this.element.appendChild(document.createElement("hr"));

        this.makeToggleButton();
        this.makeInputDiv();
    }

    makeToggleButton() {
        let tb = document.createElement("span");
        this.toggleButton = tb;
        tb.textContent = "Bestow karma?";
        tb.onclick = _ => {
            let flip = this.element.style.display == "none" ? "" : "none";
            this.element.style.display = flip;
        }
        tb.style.cssFloat = "left";
        tb.onmouseenter = _ => tb.style.textDecoration = "underline";
        tb.onmouseout = _ => tb.style.textDecoration = "none";
    }

    makeInputDiv() {
        let prompt: HTMLSpanElement = document.createElement("span");
        this.element.appendChild(prompt);
        prompt.style.display = "block";
        prompt.style.textAlign = "center";
        prompt.textContent = "Not yet implemented!";
    }
}
