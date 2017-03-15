import { timeSinceElement } from '../tools/formatting';


export class Message {
    user: string;
    source: string;
    date: Date;

    element: HTMLDivElement;


    constructor(data: any) {
        this.user = data.author.username;
        this.source = data.source;
        this.date = new Date(data.dateCreated);

        this.element = document.createElement("div");

        let heading = document.createElement("div");
        heading.className = "ce-message-heading";

        let author = document.createElement("span");
        author.textContent = this.user;
        let time = timeSinceElement(this.date);
        time.style.cssFloat = "right";

        heading.appendChild(author);
        heading.appendChild(time);

        let body = document.createElement("p");
        body.textContent = this.source;
        body.className = "ce-message-body";

        this.element.appendChild(heading);
        this.element.appendChild(body);
    }
}