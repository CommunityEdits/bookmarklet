/**
 * Returns some client info we get from the browser.
 * @return {browser, version, os}
 *      Object {browser: "Chrome", version: "50", os: "UNIX"}
 *      Object { browser: "Firefox", version: "46", os: "Windows" }
 * http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
 */
export function get_client_info() {
    let nav = navigator.appVersion,
        os = 'unknown',
        client = (() => {
            let agent = navigator.userAgent,
                engine = agent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
                build;

            if (/trident/i.test(engine[1])) {
                build = /\brv[ :]+(\d+)/g.exec(agent) || [];
                return { browser: 'IE', version: (build[1] || '') };
            }

            if (engine[1] === 'Chrome') {
                build = agent.match(/\bOPR\/(\d+)/);

                if (build !== null) {
                    return { browser: 'Opera', version: build[1] };
                }
            }

            engine = engine[2] ? [engine[1], engine[2]] : [navigator.appName, nav, '-?'];

            if ((build = agent.match(/version\/(\d+)/i)) !== null) {
                engine.splice(1, 1, build[1]);
            }

            return {
                browser: engine[0],
                version: engine[1]
            };
        })();

    switch (true) {
        case nav.indexOf('Win') > -1:
            os = 'Windows';
            break;
        case nav.indexOf('Mac') > -1:
            os = 'MacOS';
            break;
        case nav.indexOf('X11') > -1:
            os = 'UNIX';
            break;
        case nav.indexOf('Linux') > -1:
            os = 'Linux';
            break;
    }

    client["os"] = os;
    return client;
}
