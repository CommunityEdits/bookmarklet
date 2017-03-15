interface IAuthor {
    id: string;
    username: string;
}


interface IComment {
    id: string;
    author: IAuthor;
    source: string;
    dateCreated: number;
}


interface IProposal {
    id: string;
    dateCreated: number;
    author: IAuthor;
    
    versionHash: string;
    index: number;
    original: string;
    proposed: string;

    status: number;

    merit: number;
    sin: number;

    comments: IComment[];
}


/**
 * For chat.
 */
interface IMessage {
    username: string;
    source: string;
    date: Date;
}