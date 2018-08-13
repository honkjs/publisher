<div>
  <!-- npm -->
  <a href="https://www.npmjs.com/package/@honkjs/publisher">
    <img src="https://img.shields.io/npm/v/@honkjs/publisher.svg?style=flat-square" alt="npm version" />
  </a>
  <!--  dependencies -->
  <a href="https://david-dm.org/honkjs/publisher">
    <img src="https://david-dm.org/honkjs/publisher.svg?style=flat-square" alt="dependency status" />
  </a>
  <!-- dev dependencies  -->
  <a href="https://david-dm.org/honkjs/publisher&type=dev">
    <img src="https://david-dm.org/honkjs/publisher/dev-status.svg?style=flat-square" alt="dev dependency status" />
  </a>
  <!-- coverage -->
  <a href="https://codecov.io/github/honkjs/publisher">
    <img src="https://img.shields.io/codecov/c/github/honkjs/publisher/master.svg?style=flat-square" alt="test coverage" />
  </a>
  <!-- build -->
  <a href="https://travis-ci.org/honkjs/publisher">
    <img src="https://img.shields.io/travis/honkjs/publisher/master.svg?style=flat-square" alt="build status" />
  </a>
</div>

# honkjs/publisher

Single event type publisher. Allows for type safe custom arguments publishing.

# Example

```ts
import { Publisher } from '@honkjs/publisher';

// the type of function can be anything that returns void or boolean.
// any other params are allowed.
type MyEvent = (a: string, b: number) => void;

const event = new Publisher<MyEvent>();

const unsub = event.subscribe((a, b) => {
  console.log('published', a, b);
});

event.publish('hello', 5); // output: published, hello, 5

unsub();

event.publish('hello?', 0); // output: nothing
```

# Creating a store

Let's build out a store that generates events when the state is changed.

```ts
import { Publisher } from '@honkjs/publisher';

export function createStore<S>(initialState: S) {
  let state = initialState;
  let events = new Publisher<(state: S) => void>();

  return {
    setState: (action) => {
      state = action(state);
      events.publish(state);
    },
    getState: () => state,
    subscribe: (listener) => events.subscribe(listener),
  };
}

const state = { data: 'test' };

const store = createStore(state);

const unsub = store.subscribe((s) => {
  console.log('updated', s);
});

store.setState({ data: 'different' });
// outputs: updated, { data: different }

unsub();
```

This functionality is built for you in [@honkjs/store.](https://github.com/honkjs/store)
