/**
 * http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
 */
export function timeSince(date: number | Date) {
    var seconds = Math.floor((<any>new Date() - <any>date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}


export function timeSinceElement(date: number | Date) {
    let element = document.createElement("span");
    timeRefresher(element, new Date(date));

    return element;
}


function timeRefresher(element: HTMLSpanElement, date: Date) {
    element.title = String(date);
    element.textContent = `${timeSince(date)} ago`;

    if (Number(new Date()) - Number(date) < 2 * 60 * 1000) {
        setTimeout(() => {
            timeRefresher(element, date);
        }, 1 * 1000);  // Refresh every second.
    } else if (Number(new Date()) - Number(date) < 60 * 60 * 1000) {
        setTimeout(() => {
            timeRefresher(element, date);
        }, 60 * 1000);  // Refresh every minute.
    } else {
        setTimeout(() => {
            timeRefresher(element, date);
        }, 60 * 60 * 1000);  // Refresh every hour.
    }
}
