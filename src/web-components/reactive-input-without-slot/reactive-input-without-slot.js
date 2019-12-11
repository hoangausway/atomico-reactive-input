import { h, customElement, useEffect, useEvent } from 'atomico'
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { useEventStream } from './useEventStream'

/*
  PROPS
  - text: text to set as value of input element
  - debounce: number of miliseconds to accumulate stream events; default: 300ms
  - placeholder: text placeholder for input element
*/
const ReactiveInputWithoutSlot = props => {
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

  // observe 'keyupChars$' stream and dispatch typed chars accordingly
  useEffect(() => {
    const sub = keyUpChars$.subscribe(typedchars =>
      dispatchTypedChars({ typedchars })
    )
    return () => sub.unsubscribe()
  }, [])

  return (
    <host shadowDom style='width: 100%; height:100%'>
      <input
        id='input'
        placeholder={props.placeholder}
        onkeyup={keyupEmit}
        value={props.text}
        style={style()}
      />
    </host>
  )
}

ReactiveInputWithoutSlot.props = {
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
  },
  placeholder: {
    type: String,
    get value () {
      return 'type in'
    }
  }
}

export default customElement('reactive-input-without-slot', ReactiveInputWithoutSlot)

const style = () => ({
  width: '200px',
  height: '1rem',
  margin: '20px',
  padding: '3px',
  'border-radius': '3px',
  'font-size': '0.85rem',
  background: 'aqua'
})
