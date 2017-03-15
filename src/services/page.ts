import { query } from './api';
import { log } from './logging';
import { IPageInfo } from '../tools/page';


export function get_status(info: IPageInfo): Promise<any> {
    let q = `
    query {
        status (
            url:"${window.location.href}"
            selector:"${info.selector}"
            hash:"${info.hash}"
        ) {
            id
            context {
                id
            }
            proposals {
                id
                dateCreated
                author {
                    id
                    username
                }
                versionHash
                index
                original
                proposed
                status
                merit
                sin
                comments {
                    id
                    author {
                        id
                        username
                    }
                    source
                    dateCreated
                }
            }
        }
    }`;
    return query(q).then((rv: any) => {
        log.info("Got page status", rv);
        return rv;
    }).catch((reason: string) => {
        log.error("Couldn't get page status", reason);
        throw reason;
    });
}
