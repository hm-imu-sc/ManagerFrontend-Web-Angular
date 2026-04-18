export class Dummy {
    static readonly int = -1;
}

export class Empty {    
    static readonly array: [] = [];
    static readonly str: string = '';
}

export class Constants {
    dummy = Dummy;
    empty = Empty;
}