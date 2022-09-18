# react hooks helpers
A collection of utility hooks to problems I've solved over the years.

- [useAsyncScript](https://github.com/andrewangelle/react-hooks-helpers#useasyncscript)
- [useBreakpoint](https://github.com/andrewangelle/react-hooks-helpers#usebreakpoint)
- [useComposedRefs](https://github.com/andrewangelle/react-hooks-helpers#useComposedRefs)
- [useControlledReducer](https://github.com/andrewangelle/react-hooks-helpers#usecontrolledreducer)
- [useOutsideClick](https://github.com/andrewangelle/react-hooks-helpers#useoutsideclick)
- [usePrevious](https://github.com/andrewangelle/react-hooks-helpers#useprevious)
- [useRect](https://github.com/andrewangelle/react-hooks-helpers#userect)
- [useSubscription](https://github.com/andrewangelle/react-hooks-helpers#usesubscription)
- [useWindowWidth](https://github.com/andrewangelle/react-hooks-helpers#usewindowwidth)
<hr />

### useAsyncScript

- A stateful hook for asynchronously loading 3rd party scripts in the browser. For example reCAPTCHA or google maps.

#### Example:
```typescript
const url = 'https://example.com/?default=true';

export function AsyncScriptExample(): JSX.Element | null {
  const { loading, done } = useAsyncScript(url);

  if (loading) {
    return <>Loading...</>;
  }

  if (done) {
    return <>Script complete</>;
  }

  if (error) {
    return <>Script errored</>;
  }

  return null;
}
```
<hr />

### useBreakpoint

- A hook that returns the current breakpoint according to the browser's window size. 

Example:
```typescript
export function BreakpointExample(){
  const breakpoint = useBreakpoint();

  return (
    <div>
      <div>{`Current breakpoint is: ${breakpoint}`}</div>
    </div>
  );
}
```

<hr />

### useComposedRefs

- A hook to combine multiple instances of a ref into 1 instance to pass to an element. 

#### Example:
```typescript
const ForwardedRefComponent = forwardRef<HTMLElement, PropsWithChildren<{}>>(
  (props, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const ref = useComposedRefs(internalRef, forwardedRef);

    return (
      <div ref={ref}>
        {props.children}
      </div>
    );
  }
);
```
<hr />

### useControlledReducer

TODO

<hr />

### useOutsideClick

- A hook that will execute a callback when a click occurs outside of an element.

#### Example:
```typescript
function OutsideClickExample(){
  const callback = (): void => {
    alert('Clicked outside of the button');
  };
  const ref = useOutsideClick(callback);

  return (
      <button ref={ref}>Click outside of me</button>
  );
}
```

<hr />

### usePrevious

- A hook that will keep track of the previous state of a stateful value. 

#### Example:
```typescript

export function PreviousStateExample() {
  const [count, setCount] = useState(0);
  const previousState = usePrevious(count);

  function increaseCount() {
    setCount(prevState => prevState + 1);
  }

  function decreaseCount() {
    setCount(prevState => {
      const nextState = prevState - 1;
      return nextState < 0 ? 0 : nextState;
    });
  }

  return (
    <div>
      <button onClick={increaseCount}>Increase</button>
      <button onClick={decreaseCount}>Decrease</button>

      <div>
        {`Counter: ${count}`}
        
        <div>{`Previous count: ${previousState}`}</div>
      </div>
    </div>
  );
}
```

<hr />

### useRect

- A hook that returns the current DOMRect measurements for a DOM element

#### Example:
```typescript
function DOMRectExample(){
  const ref = useRef<HTMLDivElement | null>(null);
  const rect = useRect(ref);

  console.log(rect);

  return (
    <div ref={ref}>
      My DOMRect will be tracked
    </div>
  )
}
```

<hr />

### useSubscription

TODO


<hr />

### useWindowWidth

- A hook that returns the current width of the browser window.

#### Example:
```typescript
export function WindowWidthExample() {
  const width = useWindowWidth();

  return <div>{`Window's width is ${width}px`}</div>;
}
```