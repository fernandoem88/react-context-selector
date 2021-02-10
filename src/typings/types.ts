declare module 'types' {
  export interface Dictionary<T = any> {
    [K: string]: T
  }
  export class Subject<T = any> {
    constructor()
    next(value: T): void
    subscribe(subscriber: (value: T) => void): { unsubscribe: () => void }
  }
  export interface useContextSelector<T> {
    <Selector extends (state: T) => any>(
      selector: Selector
    ): ReturnType<Selector>
  }
}

declare module 'shallow-utils' {
  export function shallowEqual<T extends any>(v1: T, v2: T): boolean
  export function shallowEqualExcept(): any
  export function shallowItemsDifferExcept(): any
}

declare module 'uniqid'
