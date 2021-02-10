export declare class Subject<T = any> {
    private subject;
    constructor();
    next(value: T): void;
    subscribe(subscriber: (value: T) => void): import("rx-subject").Subscription;
}
