export class ParserError extends Error {
    constructor() {
        super();
    }
}

export class ReferenceError extends ParserError {
    ref: string;

    constructor(ref: string) {
        super();
        this.ref = ref;
    }
}

export class ArithmeticError extends ParserError {
    fun: string;

    constructor(fun: string) {
        super();
        this.fun = fun;
    }
}

export class DivisionByZeroError extends ParserError {}

export class CircularReferenceError extends ParserError {}
