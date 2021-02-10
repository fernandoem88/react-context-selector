import React from 'react';
export declare const createContextSelector: <T extends unknown = any>(ctx: React.Context<T>) => [React.MemoExoticComponent<() => null>, <Selector extends (state: T) => any>(selector: Selector) => ReturnType<Selector>];
