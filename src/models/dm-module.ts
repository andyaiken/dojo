export interface DMModule {
    id: string;
    name: string;
    desc: string;

    getContent(): JSX.Element;
}
