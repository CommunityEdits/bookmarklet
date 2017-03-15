interface IMe {
    id: string;
    username: string;
    p: Promise<IMe>;

    isAuthenticated: boolean;

    init(): void;

    propose_edit(index: number, original: string, proposal: string): Promise<any>;
    post_comment(context: string, comment: string): Promise<any>;
}


interface IIOComponent {
    add_proposal(pro: IProposal): void;
}
