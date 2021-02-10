import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback
} from 'react'
import produce from 'immer'
import { shallowEqual } from 'shallow-utils'
import { useForceUpdate } from '../hooks'
import { Subject } from './subject'

export const createContextSelector = <T extends any = any>(
  ctx: React.Context<T>
) => {
  let getState = () => (null as any) as T
  const dispatcher = new Subject()
  let wrapperMounted = false
  const useContextSelector = <Selector extends (state: T) => any>(
    selector: Selector
  ) => {
    const [initialState] = useState(() => {
      if (!wrapperMounted) {
        throw new Error(
          'the HookWrapper component should be mounted directly under the context provider'
        )
      }
      return selector(getState()) as T
    })
    const selectorRef = useRef(selector)
    selectorRef.current = selector
    const stateRef = useRef({ value: initialState })

    const checkUpdate = useCallback((ctxState?: T) => {
      const newState = selectorRef.current(ctxState || getState())
      const isEqual = shallowEqual(
        { value: newState },
        { value: stateRef.current.value }
      )
      if (isEqual) {
        return false
      }
      stateRef.current = { value: produce(newState, () => {}) as any }
      return true
    }, [])
    const shouldCheckEqualityInComponent = useRef(false)

    if (shouldCheckEqualityInComponent.current) {
      // when the component itself re-renders but not because of a context update
      checkUpdate()
    } else {
      shouldCheckEqualityInComponent.current = true
    }

    const forceUpdate = useForceUpdate()
    useEffect(() => {
      const doUpdate = () => {
        if (!wrapperMounted) return
        const shouldUpdate = checkUpdate()
        if (shouldUpdate) {
          // we already check the shallow equal here
          shouldCheckEqualityInComponent.current = false
          forceUpdate()
        }
      }
      const subscription = dispatcher.subscribe(doUpdate)
      doUpdate() // first update
      return () => {
        subscription.unsubscribe()
      }
    }, [])
    return stateRef.current.value as ReturnType<Selector>
  }

  const Cleanner = React.memo(() => {
    const ctxState = useContext(ctx)
    getState = () => ctxState
    wrapperMounted = true
    useEffect(() => {
      dispatcher.next(ctxState)
    })
    useEffect(() => {
      return () => {
        wrapperMounted = false
      }
    }, [])
    return null
  })

  return [Cleanner, useContextSelector] as [
    typeof Cleanner,
    typeof useContextSelector
  ]
}
