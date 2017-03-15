import env from '../environment';


export function query(query: string): Promise<any> {
    let p = new Promise(
        function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.open("POST", env.apiEndpoint, true);
            request.withCredentials = true;
            request.setRequestHeader("Content-type", "application/graphql");
            request.setRequestHeader("Accept", "application/json")
            request.onreadystatechange = function (ev) {
                let r = <XMLHttpRequest>ev.target;
                // Limiting to 200 only allows successful requests...
                // if (r.readyState != 4 || r.status != 200) {
                if (r.readyState != 4) {
                    return;
                }

                let response = JSON.parse(r.responseText);
                if (response.errors) {
                    let reason = response.errors.map(({message}: any) => message).join(" ");
                    reject(reason);
                } else {
                    resolve(response.data);
                }
            };
            request.send(query);
        });
    return p;
}
