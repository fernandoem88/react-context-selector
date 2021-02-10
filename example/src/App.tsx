import React, { useState, createContext } from 'react'
import { createContextSelector } from 'react-context-selector'

const ctxValue = { x: 1, title: 'pippo-test' }
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
        increment x
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
