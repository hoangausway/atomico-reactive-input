# atomico-reactive-input
Show how to implement an reactive input component using Atomico with RxJS

## Subjects

* Web component with Atomico
* Reactive with RxJS

## To show
- Using Atomico and RxJS to make reactive web component
- With slot, user code can apply CSS for inserted elements as normal.

(Slot is more 'open' regarding styling. However, without slot there should be some way to let user code manipulate CSS behind shadow dom using Javascript)


## Takeaways
**Engage DOM event with RxJS stream using Atomico useMemo/useCallback**
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

Usage of useEventStream:

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

**Emit stream within useEffect**
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
**Subscribe/unsubscribe stream within useEffect**
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



