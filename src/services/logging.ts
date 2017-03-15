import env from "../environment";


class Logger {
    /**
     * debug = 4
     * info = 3
     * warn = 2
     * error = 1
     * none = 0
     */
    level: number;
    id: string;
    constructor(id: string, loglevel: number = 4) {
        this.id = id;
        this.level = loglevel;
    }
    debug(message?: any, ...optionalParams: any[]): void {
        if (this.level < 4) {
            return;
        }
        console.log("DEBUG", `[${this.id}]`, message, ...optionalParams);
    }
    info(message?: any, ...optionalParams: any[]): void {
        if (this.level < 3) {
            return;
        }
        console.info("INFO", `[${this.id}]`, message, ...optionalParams);
    }
    warn(message?: any, ...optionalParams: any[]): void {
        if (this.level < 2) {
            return;
        }
        console.warn("WARN", `[${this.id}]`, message, ...optionalParams);
    }
    error(message?: any, ...optionalParams: any[]): void {
        if (this.level < 1) {
            return;
        }
        console.error("ERROR", `[${this.id}]`, message, ...optionalParams);
    }
}


export var log = new Logger("insight", env.logLevel);
