import { h, customElement, useEffect, useEvent, useRef } from 'atomico'
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { useEventStream } from './useEventStream'

/*
  PROPS
  - text: text to set as value of input element
  - debounce: number of miliseconds to accumulate stream events; default: 300ms
  - placeholder: text placeholder for input element
*/
const ReactiveInput = props => {
  const ref = useRef()

  // create a pair of event emitter 'keyupEmit' and related stream 'keyup$'
  const [keyupEmit, keyup$] = useEventStream()

  // - map 'keyup$' stream to typed sequence
  // - debounce keyup event
  // - fire event if accumulated input value changed
  const keyUpChars$ = keyup$.pipe(
    map(e => e.target.value),
    debounceTime(props.debounce),
    distinctUntilChanged()
  )

  // prepare function to dispatch event 'typedchars'
  const dispatchTypedChars = useEvent('typedchars', {
    composed: true,
    bubbles: true
  })

  // assign onkeyup for input element
  useEffect(() => {
    const slot = ref.current.shadowRoot.querySelector('slot[name="input"]')
    slot.onkeyup = keyupEmit
  }, [])

  // observe 'keyupChars$' stream and dispatch typed chars accordingly
  useEffect(() => {
    const sub = keyUpChars$.subscribe(typedchars =>
      dispatchTypedChars({ typedchars })
    )
    return () => sub.unsubscribe()
  }, [])

  return (
    <host shadowDom ref={ref}>
      <slot name='input' />
    </host>
  )
}

ReactiveInput.props = {
  text: {
    type: String,
    get value () {
      return ''
    }
  },
  debounce: {
    type: Number,
    get value () {
      return 300
    }
  }
}

export default customElement('reactive-input', ReactiveInput)

const style = () => `{
  width: '100%',
  padding: '3px',
  background: 'lightgray'
}`
