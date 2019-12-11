# atomico-reactive-input
An simple reactive input component using Atomico with RxJS

## Subjects

* Web component with Atomico
* Reactive with RxJS

## To show
- Using Atomico and RxJS to make reactive web component
- Styling input component in cases with or without using slot.

For more advanced example please see:
[The Conway's Game Of Life using Atomico and RxJS](https://github.com/hoangausway/atomico-game-of-life)

## Takeaways
**Engage DOM event with RxJS stream using Atomico `useMemo`/`useCallback`**
```bash
/src/web-components/reactive-input/useEventStream.js

import { useMemo } from 'atomico'
import { Subject } from 'rxjs'

export const useEventStream = (dependencies = []) => {
  const eventStream$ = useMemo(() => new Subject(), dependencies)
  const eventEmit = e => eventStream$.next(e)
  return [eventEmit, eventStream$]
}
# Note: useCallback maybe OK defining eventEmit if dependencies were important
# const eventEmit = useCallback(e => eventStream$.next(e), dependencies)
# at the writing moment the useCallback not available yet.

```

Usage of `useEventStream`:

```bash
/src/web-components/reactive-input/reactive-input.js
import { useEventStream } from './useEventStream'
import { map } from 'rxjs/operators'
...
# define the pair of keyup event emitter and related stream
const [keyupEmit, keyup$] = useEventStream()
...
# manipulating keyup$ stream
const keyUpChars$ = keyup$.pipe(
    map(e => e.target.value),
    debounceTime(300),
    distinctUntilChanged()
  )
```

**Emit stream within `useEffect`**
```bash
/src/web-components/reactive-input/reactive-input.js
import { useEffect } from 'atomico'
...
useEffect(() => {
    ...
    const slot = shadowRoot.querySelector('slot[name="input"]')
    slot.onkeyup = keyupEmit
  }, [])
```
**Subscribe/unsubscribe stream within `useEffect`**
```bash
/src/web-components/reactive-input/reactive-input.js
import { useEffect } from 'atomico'
...
  useEffect(() => {
    const sub = keyUpChars$.subscribe(typedchars =>
      dispatchTypedChars({ typedchars })
    )
    return () => sub.unsubscribe()
  }, [])
```

**Outside code to listen to event `typedchars`**
```bash
/index.html
...
# define array `keys`
...
# get element `reactive-input`
const reactiveInput = document.getElementById("reactive-input-id")

# listen to event `typedchars`
reactiveInput.addEventListener('typedchars', e => {
  const typedchars = e.detail.typedchars
  const filteredKeys = (keys.filter(v => v.indexOf(typedchars.toUpperCase()) > -1))
  divFilteredKeys.innerHTML = filteredKeys.join("<br>") # show filtered result
})
```
**Styling `input slot` in outside code**
```bash
/index.html
...
<style>
input {
  width: 200px;
  height: 1rem;
  margin: 20px;
  padding: 3px;
  border-radius: 3px;
  font-size: 0.85rem;
}
</style>
...
<reactive-input id="reactive-input-id">
  <input slot="input" placeholder="reactive WITH slot" />
</reactive-input>
```


