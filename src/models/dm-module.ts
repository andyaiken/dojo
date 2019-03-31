export interface DMModule {
    id: string;
    name: string;
    desc: string;

    init: () => void;
    getContent: () => JSX.Element;
}
