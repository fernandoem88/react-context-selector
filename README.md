# react-context-selector

> This small package will help us to clean react context unwanted re-renders using a selector hook

[![NPM](https://img.shields.io/npm/v/react-context-selector.svg)](https://www.npmjs.com/package/react-context-selector)

## Install

```bash
npm install --save react-context-selector
```

## Usage

we should import **createContextSelector** from _react-context-selector_ to create a **Cleanner component** that should be mounted directly under the context provider and a **selector hook** to use instead of the standard _React.useContext_

```tsx
import React, { createContext } from 'react'
import { createContextSelector } from 'react-context-selector'

const ctx = createContext(undefined as State)

const [Cleanner, useContextSelector] = createContextSelector(ctx)

const ProviderText = () => {
  return (
    <ctx.Provider value={state}>
      {/* the Cleanner component should be mounted directly under the Provider
      and before all other components in the context tree*/}
      <Cleanner />
      {/*then we can mount our consummer components*/}
      {props.children}
    </ctx.Provider>
  )
}
// now we can define a component that consumes the context state
const ConsummerTest = () => {
  // this conponent will re-render only if value1 changes
  const value1 = useContextSelector((state) => {
    // do something with the context state and return whatever you want
    return state.value1
  })
}

const RootTest = () => {
  return (
    <ProviderText>
      <ConsummerTest />
    </ProviderText>
  )
}
```

check a working example [here](https://codesandbox.io/s/clean-context-example-5jgbn?file=/src/components/App.jsx:1216-1234)

## see also

- [react-requests-manager](https://www.npmjs.com/package/react-requests-manager)
- [react-hooks-in-callback](https://www.npmjs.com/package/react-hooks-in-callback)
- [react-redux-selector-utils](https://www.npmjs.com/package/react-redux-selector-utils)

## License

MIT © [https://github.com/fernandoem88/react-context-selector](https://github.com/https://github.com/fernandoem88/react-context-selector)
