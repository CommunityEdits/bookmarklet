import { log } from './logging';


declare global {
    interface Window {
        JsDiff: IJsDiff;
    }
}

interface IChange {
    /**
     * Text content.
     */
    value: string;

    /**
     * True if the value was inserted into the new string.
     */
    added: boolean;

    /**
     * True if the value was removed from the old string.
     */
    removed: boolean;
}

interface IJsDiff {
    /**
     * Diffs two blocks of text, comparing character by character.
     */
    diffChars(oldStr: string, newStr: string, options?: any): IChange[];

    /**
     * Diffs two blocks of text, comparing word by word, ignoring whitespace.
     */
    diffWords(oldStr: string, newStr: string, options?: any): IChange[];

    // ... Others I probably won't ever use.
}


class Differ {
    element: HTMLScriptElement;
    p: Promise<Differ>;

    constructor() {
        window["ce"] = window["ce"] || {};
        window["ce"]["differ"] = this;
        log.debug("differ", this);

        this.p = new Promise(resolve => {
            this.element = document.createElement("script");
            this.element.src = "https://cdnjs.cloudflare.com/ajax/libs/jsdiff/3.2.0/diff.min.js";
            this.element.onload = () => resolve(this);
            document.head.appendChild(this.element);
        });
    }

    diffChar(oldStr: string, newStr: string, options?: any): Promise<IChange[]> {
        return this.p.then(() => window.JsDiff.diffChars(oldStr, newStr, options));
    }

    diffWords(oldStr: string, newStr: string, options?: any): Promise<IChange[]> {
        return this.p.then(() => window.JsDiff.diffWords(oldStr, newStr, options));
    }
}


export var differ = new Differ();