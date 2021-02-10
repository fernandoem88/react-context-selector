# react-context-selector

> this is a cleanner of react context unwanted re-renders

[![NPM](https://img.shields.io/npm/v/react-context-selector.svg)](https://www.npmjs.com/package/react-context-selector)

## Install

```bash
npm install --save react-context-selector
```

## Usage

import **createContext** from **react-context-selector** to create a _cleanner component_ to mount directly under the context provider and a _selector hook_ to use instead of the standard _useContext_

```tsx
import React, { createContext } from 'react'

import { createContextSelector } from 'react-context-selector'

const ctx = createContext(undefined as State)

const [Cleanner, useContextSelector] = createContextSelector(ctx)

const RootTest = () => {
  return (
    <ctx.Provider value={state}>
      {/* the Cleanner component should be mounted directly under the Provider
      and before all other components in the context tree*/}
      <Cleanner />
      {/*here we can mount other children*/}
      <MyConsummer />
      {props.children}
    </ctx.Provider>
  )
}
// now we can define a component that consumes the context state
const MyConsummer = () => {
  // this conponent will re-render only if value1 changes
  const value1 = useContextSelector((state) => {
    // do something with the context state and return whatever you want
    return state.value1
  })
}
```

# example

```ts
import React, { useState, createContext } from 'react'
import { createContextSelector } from 'react-context-selector'

const ctxValue = { x: 1, title: 'test 123' }
const ctx = createContext(ctxValue)
export const [Cleanner, useContextSelector] = createContextSelector(ctx)

const Title = React.memo(() => {
  console.log('Title re-renders')
  // const { title } = useContext(ctx)
  const title = useContextSelector((ctx) => {
    return ctx.title
  })
  return <div>{title}</div>
})

const Number = () => {
  console.log('Number re-renders')
  // const { number } = useContext(ctx)
  const number = useContextSelector((ctx) => {
    return ctx.number
  })
  return <div>{number}</div>
}

const Root: React.FC = (props) => {
  const [state, setState] = useState(ctxValue)
  return (
    <ctx.Provider value={state}>
      <Cleanner />
      <button
        onClick={() => {
          setState((s) => {
            return { ...s, x: s.x + 1 }
          })
        }}
      >
        click to increment x
      </button>
      {props.children}
    </ctx.Provider>
  )
}

export const App = () => {
  return (
    <Root>
      <Title />
      <Number />
    </Root>
  )
}
```

## Github

[github repository](https://github.com/fernandoem88/react-context-selector)

## see also

- [react-requests-manager](https://www.npmjs.com/package/react-requests-manager): take a full control on your async actions and keep clean your reducers state

- [react-hooks-in-callback](https://www.npmjs.com/package/react-hooks-in-callback): use directly your hooks in callback

- [react-redux-selector-utils](https://www.npmjs.com/package/react-redux-selector-utils): define and use in a **clean**, **easy** and **fast** way your redux selectors

## License

MIT © [https://github.com/fernandoem88/react-context-selector](https://github.com/https://github.com/fernandoem88/react-context-selector)
