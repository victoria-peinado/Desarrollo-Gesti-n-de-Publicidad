export class Spot {

    id?: string;
    name: string;
    long: number;
    path?: string;

    constructor(name: string, long: number, path: string) {
        this.name = name;
        this.long = long;
        this.path = path;
    }
}