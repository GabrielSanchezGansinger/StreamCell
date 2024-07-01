interface IStack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
    contains(item: T): boolean;
}

export class Stack<T> implements IStack<T> {
    private stack: T[] = [];

    constructor(private capacity: number = Infinity) {}

    push(item: T): void {
        if (this.size() === this.capacity)
            throw new Error('Max size of stack reached.');
        this.stack.push(item);
    }
    pop(): T | undefined {
        return this.stack.pop();
    }
    peek(): T | undefined {
        return this.stack[-1];
    }
    size(): number {
        return this.stack.length;
    }
    contains(item: T): boolean {
        return this.stack.includes(item);
    }
}
