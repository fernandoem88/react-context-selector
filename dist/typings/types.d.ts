declare module 'types' {
    interface Dictionary<T = any> {
        [K: string]: T;
    }
    class Subject<T = any> {
        constructor();
        next(value: T): void;
        subscribe(subscriber: (value: T) => void): {
            unsubscribe: () => void;
        };
    }
    interface useContextSelector<T> {
        <Selector extends (state: T) => any>(selector: Selector): ReturnType<Selector>;
    }
}
declare module 'shallow-utils' {
    function shallowEqual<T extends any>(v1: T, v2: T): boolean;
    function shallowEqualExcept(): any;
    function shallowItemsDifferExcept(): any;
}
declare module 'uniqid';
