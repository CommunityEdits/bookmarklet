import { log } from './logging';

/**
 * Circular import issues happen when trying to register stealable tabs.
 * Just ready them here.
 */
class GlobalVars {
    stealLinks: HTMLLIElement[];
    stealPages: HTMLDivElement[];
    steal: Promise<any>;
    stealResolve: any;

    constructor() {
        window["ce"] = window["ce"] || {};
        window["ce"]["g"] = this;
        log.debug("g", this);

        this.steal = new Promise(resolve => this.stealResolve = resolve);
    }
}


export var g = new GlobalVars();
